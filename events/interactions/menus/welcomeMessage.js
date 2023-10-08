const fs = require("fs");
const fetch = require("node-fetch");
const JoinMsg = require("../../../database/guildData/joinmsg");
const path = require("path");

module.exports = async (interaction, client) => {
  if (!interaction.isStringSelectMenu()) return;

  let msg = await interaction.channel.messages.fetch(interaction.message.id);

  if (interaction.values[0] === "welcome_message") {
    await interaction.deferUpdate();

    let data;
    try {
      data = await JoinMsg.findOne({
        GuildID: interaction.guild.id,
      });
    } catch (error) {}

    if (!data) {
      await msg.edit(
        "Please send the **MESSAGE** to be setup as the Welcome Message!"
      );

      const filter = (m) => m.author.id === interaction.member.id;

      const collector = await interaction.channel.createMessageCollector({
        filter,
        time: 60_000,
      });

      collector.on("collect", async (collected) => {
        let joinMsg = collected.content;

        // Save the attached image, if there's any
        if (collected.attachments.first()) {
          let imageUrl = collected.attachments.first().url;

          let response = await fetch(imageUrl);
          let buffer = await response.buffer();

          let imgName = `welcome_${interaction.guild.id}.png`; // Change .jpg to the desired format

          // Get the path to the base folder
          let baseDir = path.resolve(__dirname, "..", "..", "..", "..");
          let imgFolderPath = path.join(baseDir, "Images");

          // Check if folder exists; if not, create it
          if (!fs.existsSync(imgFolderPath)) {
            fs.mkdirSync(imgFolderPath);
          }

          let imgPath = path.join(imgFolderPath, imgName);

          fs.writeFileSync(imgPath, buffer);
        }

        let newData = new JoinMsg({
          JoinMsg: joinMsg,
          GuildID: interaction.guild.id,
        });

        newData.save();

        await collector.stop();
        return msg.edit(`Welcome message has been set to:\n${joinMsg}`);
      });

      collector.on("end", async (collected) => {
        console.log("Collector Stopped!");
      });
    } else if (data) {
      await JoinMsg.findOneAndRemove({
        GuildID: interaction.guild.id,
      });

      return msg.edit("Welcome message has been removed!");
    }
  }
};
