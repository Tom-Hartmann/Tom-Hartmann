const voiceData = require('../../database/guildData/voiceupdates');
const { MessageEmbed } = require('discord.js');

module.exports = async (oldState, newState) => {
  const data = await voiceData.findOne({
    GuildID: newState.guild.id,
  });

  if (!data) return;

  if (
    oldState.channel == null &&
    newState.channel != null &&
    newState.channel.name == '✨private channel✨'
  ) {
    if (
      this.client.channels.cache.find(
        (c) => c.name == '✨' + oldState.member.user.tag
      )
    )
      return newState.setChannel(
        this.client.channels.cache.find(
          (c) => c.name == '✨' + oldState.member.user.tag
        )
      );
    let channel = await newState.guild.channels.create(
      '✨' + newState.member.user.tag,
      {
        type: 'voice',
        permissionOverwrites: [
          {
            id: newState.guild.roles.cache.find((r) => r.name == '@everyone')
              .id,
            allow: ['CONNECT', 'SPEAK'],
            deny: ['STREAM'],
          },
          {
            id: newState.member.id,
            allow: [
              'MUTE_MEMBERS',
              'DEAFEN_MEMBERS',
              'PRIORITY_SPEAKER',
              'STREAM',
            ],
          },
        ],
      }
    );
    let category = newState.guild.channels.cache.find(
      (c) => c.name == '✨Private Channels✨' && c.type == 'category'
    );
    if (!category)
      category = await newState.guild.channels.create('✨Private Channels✨', {
        type: 'category',
      });
    if (category && channel) await channel.setParent(category.id);
    newState.setChannel(channel.id);
  } else
    try {
      if (
        newState.channel == undefined &&
        oldState.channel.name == '✨' + oldState.member.user.tag
      ) {
        oldState.channel.delete();
      } else if (
        newState.channel.name != '✨' + oldState.member.user.tag &&
        oldState.channel.name == '✨' + oldState.member.user.tag
      ) {
        oldState.channel.delete();
        if (newState.channel.name == '✨Private Channel✨') newState.kick();
      }
    } catch {}
  //old log for voice state updates
  /*
  let oldUser = oldState.member;
  let newUser = newState.member;

  if (
    (oldUser.voice.channelId !== newUser.voice.channelId &&
      newUser.voice.channelId !== null) ||
    undefined
  ) {
    let joinEmbed = new MessageEmbed()
      .setTitle('Voice State Updates')
      .setDescription(
        `${newUser} joined the voice channel <#${newUser.voice.channelId}>`
      )
      .setColor('GREEN')
      .setTimestamp();

    newState.guild.channels.cache
      .get(data.ChannelID)
      .send({ embeds: [joinEmbed] });
  } else if (
    (oldUser.voice.channelId !== newUser.voice.channelId &&
      newUser.voice.channelId === null) ||
    undefined
  ) {
    let leaveEmbed = new MessageEmbed()
      .setTitle('Voice State Updates')
      .setDescription(
        `${newUser} left the voice channel <#${oldUser.voice.channelId}>`
      )
      .setColor('RED')
      .setTimestamp();

    newState.guild.channels.cache
      .get(data.ChannelID)
      .send({ embeds: [leaveEmbed] });
  } else if (oldState.mute !== newState.mute) {
    let muteEmbed = new MessageEmbed()
      .setTitle('Voice State Updates')
      .setDescription(`${newUser} was ${newState.mute ? 'muted' : 'unmuted'}`)
      .setColor('GREEN')
      .setTimestamp();

    newState.guild.channels.cache
      .get(data.ChannelID)
      .send({ embeds: [muteEmbed] });
  } else if (oldState.deaf !== newState.deaf) {
    let deafEmbed = new MessageEmbed()
      .setTitle('Voice State Updates')
      .setDescription(
        `${newUser} was ${newState.deaf ? 'deafened' : 'undeafened'}`
      )
      .setColor('GREEN')
      .setTimestamp();

    newState.guild.channels.cache
      .get(data.ChannelID)
      .send({ embeds: [deafEmbed] });
  }*/
};
