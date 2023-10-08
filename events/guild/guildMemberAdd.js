const memberData = require("../../database/guildData/memberupdates");
const autobanData = require("../../database/guildData/autoban");
const { EmbedBuilder } = require("discord.js");
const { ERROR_LOGS_CHANNEL } = require("../config.json");

module.exports = async (member) => {
  let data;
  let banData;
  try {
    data = await memberData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}
  try {
    banData = await autobanData.findOne({
      UserID: member.id,
    });
  } catch (error) {}
  if (banData) {
    if (banData.Global === true) {
      try {
        if (!member.bannable)
          return console.log(
            `No permissions for guild ${member.guild.name}(${member.guild.id})`
          );
        member.ban({ reason: `${banData.AddedBy}(${banData.Reason})` });
      } catch (error) {
        console.log(`There was a error in guildMemberAdd.js Line 19\n${error}`);
      }
      try {
        if (!member.bannable)
          return console.log(
            `No permissions for guild ${member.guild.name}(${member.guild.id})`
          );
        if (banData.GuildID === member.guild.id) {
          member.ban({ reason: `${banData.AddedBy}(${banData.Reason})` });
        }
      } catch (error) {
        console.log(`There was a error in guildMemberAdd.js Line 29\n${error}`);
      }
    }
  } else if (data) {
    if (banData) return;
    const embed = new EmbedBuilder()
      .setTitle("Member Joined")
      .setDescription(
        `User: ${member.user.tag} (${member})\nUser ID: ${member.id}\nAcc. Created: ${member.user.createdAt}\nServer Mmebr Count: ${member.guild.memberCount}`
      )
      .setColor("Green")
      .setTimestamp()
      .setThumbnail(`${member.user.avatarURL}`);

    try {
      member.guild.channels.cache.get(data.ChannelID).send({ embeds: [embed] });
    } catch (error) {
      console.log(error)
      member.guild.channels.cache.get(ERROR_LOGS_CHANNEL).send({ embeds: [embed]});
    }
  }
};
