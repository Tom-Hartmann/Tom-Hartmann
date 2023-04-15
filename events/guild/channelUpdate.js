const channelData = require("../../database/guildData/channelupdates");
const { EmbedBuilder } = require("discord.js");

module.exports = async (oldChannel, newChannel) => {
  let data;
  try {
    data = await channelData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}

  if (!data) return;

  if (oldChannel.name !== newChannel.name) {
    const nameEmbed = new EmbedBuilder()
      .setTitle("Channel Updates")
      .addFields({
        name: "Channel Name Changed",
        value: `${oldChannel.name} -> ${newChannel.name}`,
      })
      .setColor("Green")
      .setTimestamp();

    try {
      newChannel.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [nameEmbed] });
    } catch (error) {}
  } else if (oldChannel.topic !== newChannel.topic) {
    const topicEmbed = new EmbedBuilder()
      .setTitle("Channel Updates")
      .addFields({
        name: "Channel Topic Changed",
        value: `${oldChannel.topic} -> ${newChannel.topic}`,
      })
      .setColor("Green")
      .setTimestamp();

    try {
      newChannel.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [topicEmbed] });
    } catch (error) {}
  } else if (oldChannel.position !== newChannel.position) {
    const positionEmbed = new EmbedBuilder()
      .setTitle("Channel Updates")
      .addFields({
        name: "Channel Position Changed",
        value: `${oldChannel.position} -> ${newChannel.position}`,
      })
      .setColor("Green")
      .setTimestamp();

    try {
      newChannel.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [positionEmbed] });
    } catch (error) {}
  } else if (oldChannel.type !== newChannel.type) {
    const typeEmbed = new EmbedBuilder()
      .setTitle("Channel Updates")
      .addFields({
        name: "Channel Type Changed",
        value: `${oldChannel.type} -> ${newChannel.type}`,
      })
      .setColor("Green")
      .setTimestamp();

    try {
      newChannel.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [typeEmbed] });
    } catch (error) {}
  } else if (oldChannel.nsfw !== newChannel.nsfw) {
    const nsfwEmbed = new EmbedBuilder()
      .setTitle("Channel Updates")
      .addFields({
        name: "Channel NSFW Changed",
        value: `${oldChannel.nsfw} -> ${newChannel.nsfw}`,
      })
      .setColor("Green")
      .setTimestamp();
    try {
      newChannel.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [nsfwEmbed] });
    } catch (error) {}
  } else if (oldChannel.bitrate !== newChannel.bitrate) {
    const bitrateEmbed = new EmbedBuilder()
      .setTitle("Channel Updates")
      .addFields({
        name: "Channel Bitrate Changed",
        value: `${oldChannel.bitrate} -> ${newChannel.bitrate}`,
      })
      .setColor("Green")
      .setTimestamp();

    try {
      newChannel.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [bitrateEmbed] });
    } catch (error) {}
  } else if (oldChannel.userLimit !== newChannel.userLimit) {
    const userLimitEmbed = new EmbedBuilder()
      .setTitle("Channel Updates")
      .addFields({
        name: "Channel UserLimit Changed",
        value: `${oldChannel.userLimit} -> ${newChannel.userLimit}`,
      })
      .setColor("Green")
      .setTimestamp();

    try {
      newChannel.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [userLimitEmbed] });
    } catch (error) {}
  } else if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
    const rateLimitPerUserEmbed = new EmbedBuilder()
      .setTitle("Channel Updates")
      .addFields({
        name: "Channel RateLimitPerUser Changed",
        value: `${oldChannel.rateLimitPerUser} -> ${newChannel.rateLimitPerUser}`,
      })
      .setColor("Green")
      .setTimestamp();

    try {
      newChannel.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [rateLimitPerUserEmbed] });
    } catch (error) {}
  } else {
    return;
  }
};
