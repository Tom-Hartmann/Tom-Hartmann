const { ApplicationCommandOptionType } = require("discord.js");
const fs = require("fs");
const https = require("https");

module.exports = {
  name: "saveemojis",
  description: "Saves all emojis in a provided message to a folder",
  options: [
    {
      name: "messageid",
      description: "The ID of the message to extract emojis from",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],

  run: async (client, interaction, args) => {
    let success = true;
    try {
      const channelId = interaction.channelId;
      const messageId = interaction.options.getString("messageid");
      const channel = await client.channels.fetch(channelId);
      const message = await channel.messages.fetch(messageId);

      const emojiRegex = /<:(.*?):(\d+)>|<a:(.*?):(\d+)>/g;
      const matches = [...message.content.matchAll(emojiRegex)];

      if (matches.length === 0) {
        return interaction.reply({
          content: "No emojis found in the provided message.",
          ephemeral: true,
        });
      }

      if (!fs.existsSync("emojis")) {
        fs.mkdirSync("emojis");
      }

      for (const match of matches) {
        const emojiId = match[2] || match[4];
        const emojiName = match[1] || match[3];
        const isAnimated = match[0].startsWith("<a:");
        const extension = isAnimated ? "gif" : "png";
        const url = `https://cdn.discordapp.com/emojis/${emojiId}.${extension}`;

        https.get(url, function (response) {
          const file = fs.createWriteStream(`emojis/${emojiName}.${extension}`);
          response.pipe(file);
        });
      }
    } catch (error) {
      console.error("[ERROR] Failed to execute 'saveemojis' command:", error);
      success = false;
    } finally {
      if (success) {
        return interaction.reply({
          content: "Emojis have been saved to the 'emojis' folder.",
          ephemeral: true,
        });
      } else {
        if (!interaction.replied) {
          return interaction.reply({
            content: "An error occurred while executing the command.",
            ephemeral: true,
          });
        }
      }
    }
  },
};
