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
    .setTitle("Thread Created")
    .setDescription(
      `
Name: ${thread.name}
ID: ${thread.id}
Created By: ${thread.guild.members.cache.get(thread.ownerId)}
Parent Channel: ${thread.parent.name}`
    )
    .setColor("Green")
    .setTimestamp();

  try {
    thread.guild.channels.cache.get(data.ChannelID).send({ embeds: [embed] });
  } catch (error) {}
};
