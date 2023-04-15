const antiwordsData = require("../../database/guildData/antiwords");
const BadWords = require("bad-words");
const badWords = new BadWords();

// Function to delete the message and send a warning message
async function deleteMessageAndWarn(message) {
  // Check if bot has permission to delete messages
  if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
    // If not, send an error message and return
    return message.reply("I do not have permission to delete messages.");
  }

  // If bot has permission, delete the message and send a warning
  await message.delete();
  const warningMessage = await message.reply(
    "**No Bad Words Allowed Please Stop!**"
  );
  const time = "4s";
  setTimeout(function () {
    warningMessage.delete();
  }, ms(time));
}

module.exports = async (message) => {
  let antiwords;
  antiwords = await antiwordsData.findOne({
    GuildID: message.guild.id,
  });
  try {
    if (antiwords && badWords.check(message.content)) {
      await deleteMessageAndWarn(message);
    }
  } catch (error) {}
};
