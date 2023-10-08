const voiceStateData = require("../../../database/guildData/voiceupdates");

module.exports = async (interaction, client) => {
  if (!interaction.isStringSelectMenu()) return;

  let msg = await interaction.channel.messages.fetch(interaction.message.id);

  if (interaction.values[0] === "voice_state_updates") {
    await interaction.deferUpdate();

    let data;
    try {
      data = await voiceStateData.findOne({
        GuildID: interaction.guild.id,
      });
    } catch (error) {
      console.error("Error fetching from database:", error);
      return interaction.followUp({
        content: "An error occurred while processing your request.",
      });
    }

    if (!data) {
      await msg.edit(
        "Please send the **CHANNEL ID** to be set up for Voice State Update Logs. \nTo get an ID: \n1. Go to your Discord settings > Appearance > Scroll down > Turn on Developer Mode. \n2. Right-click on the desired channel > Copy ID."
      );

      const filter = (m) => m.author.id === interaction.member.id;

      const collector = await interaction.channel.createMessageCollector({
        filter,
        time: 300_000, // 5 minutes
      });

      collector.on("collect", async (collected, returnValue) => {
        let channel = interaction.guild.channels.cache.get(collected.content);

        if (!channel) return msg.edit("Couldn't find that channel!");

        let newData = new voiceStateData({
          ChannelID: collected.content,
          GuildID: interaction.guild.id,
        });

        newData
          .save()
          .then(() => {
            collector.stop();
            return msg.edit(
              `Voice State Updates will be logged in ${interaction.guild.channels.cache.get(
                collected.content
              )}`
            );
          })
          .catch((error) => {
            console.error("Error saving to database:", error);
            return msg.edit("An error occurred while processing your request.");
          });
      });

      collector.on("end", (collected) => {
        if (!collected.size) {
          return msg.edit(
            "Time's up! Please use the command again and provide the ID within 5 minutes."
          );
        }
        console.log("Collector Stopped!");
      });
    } else if (data) {
      await voiceStateData
        .findOneAndRemove({
          GuildID: interaction.guild.id,
        })
        .then(() => {
          return msg.edit(`Voice State Updates Logging has been stopped!`);
        })
        .catch((error) => {
          console.error("Error removing from database:", error);
          return msg.edit("An error occurred while processing your request.");
        });
    }
  }
};
