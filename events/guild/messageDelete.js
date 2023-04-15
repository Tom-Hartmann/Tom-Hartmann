const messageData = require("../../database/guildData/messagelogs");
const { EmbedBuilder } = require("discord.js");

module.exports = async (message) => {
  let data;
  try {
    data = await messageData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}

  if (!data) return;

  const channel = data.ChannelID;

  const embed = new EmbedBuilder()
    .setTitle("Message Deleted")
    .setDescription(
      `${message.author.username}'s messages was deleted in ${message.channel}`
    )
    .addFields({ name: "Message Content", value: `${message.content}` })
    .setColor("Green")
    .setTimestamp();

  try {
    message.guild.channels.cache.get(channel).send({ embeds: [embed] });
  } catch (error) {}
};
