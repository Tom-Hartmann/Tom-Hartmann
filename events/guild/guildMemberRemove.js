const memberData = require("../../database/guildData/memberupdates");
const leaveChannelData = require("../../database/guildData/leavechannel");
const leaveMsgData = require("../../database/guildData/leavemessage");
const { EmbedBuilder } = require("discord.js");
const path = require("path");
const fs = require("fs");

module.exports = async (member) => {
  let data;
  let goodbyeData;
  let byeMsgData;

  try {
    data = await memberData.findOne({
      GuildID: member.guild.id,
    });
  } catch (error) {
    console.error(error);
  }

  try {
    goodbyeData = await leaveChannelData.findOne({
      GuildID: member.guild.id,
    });
  } catch (error) {
    console.error(error);
  }

  try {
    byeMsgData = await leaveMsgData.findOne({
      GuildID: member.guild.id,
    });
  } catch (error) {
    console.error(error);
  }

  let channelToSend = goodbyeData ? goodbyeData.Bye : data.ChannelID;
  if (!channelToSend) return;

  let customMessage = byeMsgData ? byeMsgData.ByeMsg : null;
  if (customMessage) {
    customMessage = customMessage.replace("{user.mention}", member.toString());
    customMessage = customMessage.replace("{user.name}", member.user.tag);
    customMessage = customMessage.replace("{server}", member.guild.name);
    customMessage = customMessage.replace(
      "{membercount}",
      member.guild.memberCount.toString()
    );
  }

  let imagePath = path.join(
    __dirname,
    "..",
    "..",
    "Images",
    `${member.guild.id}.png`
  );
  let imageUrl = fs.existsSync(imagePath)
    ? `attachment://${member.guild.id}.png`
    : null;

  if (customMessage && imageUrl) {
    member.guild.channels.cache.get(channelToSend).send({
      content: customMessage,
      files: [imagePath],
    });
  } else if (customMessage) {
    member.guild.channels.cache.get(channelToSend).send(customMessage);
  } else {
    const embed = new EmbedBuilder()
      .setTitle("Member Left")
      .setDescription(
        `User: ${member.user.tag} (${member})\nUser ID: ${member.id}\nAcc. Created: ${member.user.createdAt}\nServer Member Count: ${member.guild.memberCount}`
      )
      .setColor("Green")
      .setTimestamp()
      .setThumbnail(`${member.user.avatarURL()}`);

    if (imageUrl) embed.attachFiles([imagePath]);

    try {
      member.guild.channels.cache.get(channelToSend).send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
    }
  }
};
