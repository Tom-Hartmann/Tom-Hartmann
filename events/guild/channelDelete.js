const channelData = require("../../database/guildData/channelupdates");
const { EmbedBuilder } = require("discord.js");

module.exports = async (channel) => {
  let data;
  try {
    data = await channelData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}

  if (!data) return;

  const embed = new EmbedBuilder()
    .setTitle("Channel Deleted")
    .setDescription(
      `Channel Name: ${channel.name}\nChannel ID: ${channel.id}\nChannel Type: ${channel.type}`
    )
    .setColor("Green")
    .setTimestamp();

  try {
    channel.guild.channels.cache.get(data.ChannelID).send({ embeds: [embed] });
  } catch (error) {}
};
