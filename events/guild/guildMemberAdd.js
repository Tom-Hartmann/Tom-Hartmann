const memberData = require("../../database/guildData/memberupdates");
const autobanData = require("../../database/guildData/autoban");
const WelcomeModel = require("../../database/guildData/welcome");
const JoinMsgModel = require("../../database/guildData/joinmsg");
const { EmbedBuilder } = require("discord.js");
const { ERROR_LOGS_CHANNEL } = require("../config.json");
const path = require("path");
const fs = require("fs");

module.exports = async (member) => {
  let data, banData, welcomeData, joinMsgData;

  try {
    data = await memberData.findOne({ GuildID: member.guild.id });
    banData = await autobanData.findOne({ UserID: member.id });
    welcomeData = await WelcomeModel.findOne({ GuildID: member.guild.id });
    joinMsgData = await JoinMsgModel.findOne({ GuildID: member.guild.id });
  } catch (error) {
    console.error("Error fetching database data:", error);
  }

  if (banData && banData.Global === true) {
    try {
      if (!member.bannable)
        return console.log(
          `No permissions for guild ${member.guild.name}(${member.guild.id})`
        );

      member.ban({ reason: `${banData.AddedBy}(${banData.Reason})` });

      if (banData.GuildID === member.guild.id) {
        member.ban({ reason: `${banData.AddedBy}(${banData.Reason})` });
      }
    } catch (error) {
      console.log(`There was an error in guildMemberAdd.js\n${error}`);
    }
  } else if (data && !banData) {
    let customMessage = joinMsgData ? joinMsgData.JoinMsg : null;

    try {
      let channelToSend = welcomeData ? welcomeData.Welcome : data.ChannelID;
      let channel = member.guild.channels.cache.get(channelToSend);

      if (customMessage) {
        sendCustomMessage(channel, member, customMessage);
      } else {
        channel.send({ embeds: [createDefaultEmbed(member)] });
      }
    } catch (error) {
      console.error("Error sending member joined notification:", error);
      member.guild.channels.cache
        .get(ERROR_LOGS_CHANNEL)
        .send({ embeds: [createDefaultEmbed(member)] });
    }
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
    "../../Images",
    `welcome_${member.guild.id}.png`
  );

  if (fs.existsSync(imagePath)) {
    channel.send({ content: replacedMessage, files: [imagePath] });
  } else {
    channel.send(replacedMessage);
  }
}

function createDefaultEmbed(member) {
  return new EmbedBuilder()
    .setTitle("Member Joined")
    .setDescription(
      `User: ${member.user.tag} (${member})\nUser ID: ${member.id}\nAcc. Created: ${member.user.createdAt}\nServer Member Count: ${member.guild.memberCount}`
    )
    .setColor("Green")
    .setTimestamp()
    .setThumbnail(`${member.user.avatarURL}`);
}
