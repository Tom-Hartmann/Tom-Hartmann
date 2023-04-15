const { EmbedBuilder } = require("discord.js");
const channelData = require("../../database/guildData/channelupdates");

module.exports = async (thread) => {
  let data;
  try {
    data = await channelData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}

  if (!data) return;

  const embed = new EmbedBuilder()
    .setTitle("Thread Deleted")
    .setDescription(
      `
Name: ${thread.name}
ID: ${thread.id}
Owner: <@!${thread.ownerId}>
Member Count: ${thread.memberCount}
Messages Sent: ${thread.messages.cache.size}
Parent Channel: ${thread.parent.name}`
    )
    .setColor("Red")
    .setTimestamp();

  try {
    thread.guild.channels.cache.get(data.ChannelID).send({ embeds: [embed] });
  } catch (error) {}
};
