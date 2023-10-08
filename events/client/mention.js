const prefixModel = require("../../database/guildData/prefix");

module.exports = async (message, client) => {
  if (message.author.bot || !message.guild) return;

  const { DEFAULT_PREFIX } = require("../../config.json");

  let prefixData;
  try {
    prefixData = await prefixModel.findOne({
      GuildID: message.guild.id,
    });
  } catch (err) {
    console.log(err);
  }

  const PREFIX = prefixData ? prefixData.Prefix : DEFAULT_PREFIX;
  client.prefix = PREFIX;

  // mentioned bot
  if (
    message.content === `<@!${client.user.id}>` ||
    message.content === `<@${client.user.id}>`
  ) {
    return message.channel.send(
      `My prefix in this server is \`${PREFIX}\`\n\nTo get a list of commands, type \`${PREFIX}help\``
    );
  }
};
