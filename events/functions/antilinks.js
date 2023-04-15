const antilinkData = require("../../database/guildData/antilink");
const ms = require("ms");

// Regular expression to match URLs
const urlRegex = /(https?:\/\/[^\s]+)/gi;

// Function to delete the message and send a warning message
async function deleteMessageAndWarn(message) {
  // Check if bot has permission to delete messages
  if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
    // If not, send an error message and return
    return message.reply("I do not have permission to delete messages.");
  }

  // If bot has permission, delete the message and send a warning
  await message.delete();
  const warningMessage = await message.channel.send(
    "No links allowed while anti-link is active!"
  );
  const time = "2s";
  setTimeout(function () {
    warningMessage.delete();
  }, ms(time));
}

module.exports = async (message) => {
  let antilink;
  try {
    antilink = await antilinkData.findOne({
      GuildID: message.guild.id,
    });
  } catch (error) {}
  try {
    if (antilink && urlRegex.test(message.content)) {
      await deleteMessageAndWarn(message);
    }
  } catch (error) {}
};
