const memberData = require("../../database/guildData/memberupdates");
const { MessageEmbed } = require("discord.js");

module.exports = async (oldMember, newMember) => {
  let data;
  try {
    data = await memberData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}

  if (!data) return;

  if (newMember.nickname !== oldMember.nickname) {
    let oldNickname = oldMember.nickname
      ? oldMember.nickname
      : oldMember.user.username;
    let newNickname = newMember.nickname
      ? newMember.nickname
      : newMember.user.username;
    let nicknameEmbed = new MessageEmbed()
      .setTitle(`${newMember.user.tag}`)
      .addFields({
        name: "User Nickname Changed",
        value: `${oldNickname} => ${newNickname}`,
      })
      .setColor("GREEN")
      .setTimestamp()
      .setThumbnail(`${newMember.user.avatarURL()}`);

    try {
      newMember.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [nicknameEmbed] });
    } catch (error) {}
  } else if (newMember.user.username !== oldMember.user.username) {
    let oldusername = oldMember.user.username;
    let newusername = newMember.user.username;

    let usernameEmbed = new MessageEmbed()
      .setTitle(`${newMember.user.tag}`)
      .addFields({
        name: "User Username Changed",
        value: `${oldusername} => ${newusername}`,
      })
      .setColor("GREEN")
      .setTimestamp()
      .setThumbnail(`${newMember.user.avatarURL()}`);

    try {
      newMember.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [usernameEmbed] });
    } catch (error) {}
  } else if (newMember.user.avatarURL() !== oldMember.user.avatarURL()) {
    let oldavatar = oldMember.user.avatarURL();
    let newavatar = newMember.user.avatarURL();

    let avatarEmbed = new MessageEmbed()
      .setTitle(`${newMember.user.tag}`)
      .addFields({
        name: "User Avatar Changed",
        value: `${oldavatar} => ${newavatar}`,
      })
      .setColor("GREEN")
      .setTimestamp()
      .setThumbnail(`${newMember.user.avatarURL()}`);
    try {
      newMember.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [avatarEmbed] });
    } catch (error) {}
  } else {
    return;
  }
};
