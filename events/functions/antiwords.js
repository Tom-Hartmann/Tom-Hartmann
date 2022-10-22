const antiwordsData = require("../../database/guildData/antiwords");
const config = require("../../words.json");
module.exports = async (message) => {
  const antiwords = await antiwordsData.findOne({
    GuildID: message.guild.id,
  });
  const ignoremods = await ignoremodsSystem.findOne({
    GuildID: message.guild.id,
  });
  if (ignoremods) {
    if (message.member.permissions.has("MANAGE_MESSAGES")) {
      return;
    } else if (antiwords) {
      if (
        config.filter.some((word) =>
          message.content.toLowerCase().includes(word)
        )
      ) {
        if (message.deletable)
          try {
            await message.delete();
            message
              .reply("**No Bad Words Allowed Please Stop!**")
              .then((msg) => {
                let time = "4s";
                setTimeout(function () {
                  msg.delete();
                }, ms(time));
              });
          } catch (error) {}
      }
    } else {
      return;
    }
  } else if (!antiwords) {
    return;
  }
};
