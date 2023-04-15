const voiceData = require("../../database/guildData/voiceupdates");
const { EmbedBuilder } = require("discord.js");

module.exports = async (oldState, newState) => {
  let data;
  try {
    data = await voiceData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}

  if (!data) return;

  let oldUser = oldState.member;
  let newUser = newState.member;

  if (
    (oldUser.voice.channelId !== newUser.voice.channelId &&
      newUser.voice.channelId !== null) ||
    undefined
  ) {
    let joinEmbed = new EmbedBuilder()
      .setTitle("Voice State Updates")
      .setDescription(
        `${newUser} joined the voice channel <#${newUser.voice.channelId}>`
      )
      .setColor("Green")
      .setTimestamp();

    try {
      newState.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [joinEmbed] });
    } catch (error) {}
  } else if (
    (oldUser.voice.channelId !== newUser.voice.channelId &&
      newUser.voice.channelId === null) ||
    undefined
  ) {
    let leaveEmbed = new EmbedBuilder()
      .setTitle("Voice State Updates")
      .setDescription(
        `${newUser} left the voice channel <#${oldUser.voice.channelId}>`
      )
      .setColor("Red")
      .setTimestamp();

    try {
      newState.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [leaveEmbed] });
    } catch (error) {}
  } else if (oldState.mute !== newState.mute) {
    let muteEmbed = new EmbedBuilder()
      .setTitle("Voice State Updates")
      .setDescription(`${newUser} was ${newState.mute ? "muted" : "unmuted"}`)
      .setColor("Green")
      .setTimestamp();

    newState.guild.channels.cache
      .get(data.ChannelID)
      .send({ embeds: [muteEmbed] });
  } else if (oldState.deaf !== newState.deaf) {
    let deafEmbed = new EmbedBuilder()
      .setTitle("Voice State Updates")
      .setDescription(
        `${newUser} was ${newState.deaf ? "deafened" : "undeafened"}`
      )
      .setColor("Green")
      .setTimestamp();

    try {
      newState.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [deafEmbed] });
    } catch (error) {}
  }
};
