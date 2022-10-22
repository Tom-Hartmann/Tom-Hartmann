const antilinkData = require("../../database/guildData/antilink");
const ignoremodsSystem = require("../../database/guildData/ignoremods");
const ms = require("ms");

module.exports = async (message) => {
  const antilink = await antilinkData.findOne({
    GuildID: message.guild.id,
  });
  const ignoremods = await ignoremodsSystem.findOne({
    GuildID: message.guild.id,
  });
  if (ignoremods) {
    if (message.member.permissions.has("MANAGE_MESSAGES")) {
      return;
    } else {
      if (antilink) {
        if (
          message.content.match("https://") ||
          message.content.match("discord.gg") ||
          message.content.match("www.")
        ) {
          message.delete();
          let msg = message.channel
            .send("No links allowed while anti-link is active!")
            .then((msg) => {
              let time = "2s";
              setTimeout(function () {
                msg.delete();
              }, ms(time));
            });
        }
      }
    }
  }
};
