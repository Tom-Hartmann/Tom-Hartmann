const memberData = require("../../database/guildData/memberupdates");
const leaveChannelData = require("../../database/guildData/leavechannel");
const leaveMsgData = require("../../database/guildData/leavemessage");
const { EmbedBuilder } = require("discord.js");
const path = require("path");
const fs = require("fs");

module.exports = async (member) => {
  let data, goodbyeData, byeMsgData;

  try {
    data = await memberData.findOne({ GuildID: member.guild.id });
    goodbyeData = await leaveChannelData.findOne({ GuildID: member.guild.id });
    byeMsgData = await leaveMsgData.findOne({ GuildID: member.guild.id });
  } catch (error) {
    console.error("Error fetching database data:", error);
    return; 
  }

  let channelToSend = goodbyeData
    ? goodbyeData.Bye
    : data
    ? data.ChannelID
    : null;

  if (!channelToSend) {
    console.error("No channel found to send the goodbye message.");
    return;
  }

  let customMessage = byeMsgData ? byeMsgData.ByeMsg : null;

  try {
    let channel = member.guild.channels.cache.get(channelToSend);

    if (!channel) {
      console.error(`Channel with ID ${channelToSend} not found.`);
      return;
    }

    if (customMessage) {
      sendCustomMessage(channel, member, customMessage);
    } else {
      channel.send({ embeds: [createDefaultEmbed(member)] });
    }
  } catch (error) {
    console.error("Error sending member left notification:", error);
  }
};

function sendCustomMessage(channel, member, customMessage) {
  let replacedMessage = customMessage
    .replace(/{user.mention}/g, member.user.toString())
    .replace(/{user.name}/g, member.user.tag)
    .replace(/{server}/g, member.guild.name)
    .replace(/{membercount}/g, member.guild.memberCount.toString());

  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "Images",
    `goodbye_${member.guild.id}.png`
  );

  if (fs.existsSync(imagePath)) {
    channel.send(replacedMessage, { files: [imagePath] });
  } else {
    channel.send(replacedMessage);
  }
}

function createDefaultEmbed(member) {
  return new EmbedBuilder()
    .setTitle("Member Left")
    .setDescription(
      `User: ${member.user.tag} (${member})\nUser ID: ${member.id}\nAcc. Created: ${member.user.createdAt}\nServer Member Count: ${member.guild.memberCount}`
    )
    .setColor("Red")
    .setTimestamp()
    .setThumbnail(`${member.user.avatarURL()}`);
}
