const memberData = require("../../database/guildData/memberupdates");
const rolesdata = require("../../database/guildData/tempban");
const { MessageEmbed } = require("discord.js");

module.exports = async (member) => {
  const data = await memberData.findOne({
    GuildID: member.guild.id,
  });
  const getbackroles = await rolesdata.findOneAndDelete({
    User: member.id,
  });
  if (getbackroles) {
    const roleSplitter = getbackroles.Roles.split(", ");
    for (const role of roleSplitter) {
      try {
        member.roles.add(role);
      } catch (error) {
        console.log(error);
      }
    }
  } else if (data) {
    const embed = new MessageEmbed()
      .setTitle("Member Joined")
      .setDescription(
        `User: ${member.user.tag} (${member})\nUser ID: ${member.id}\nAcc. Created: ${member.user.createdAt}\nServer Mmebr Count: ${member.guild.memberCount}`
      )
      .setColor("GREEN")
      .setTimestamp()
      .setThumbnail(`${member.user.avatarURL}`);

    member.guild.channels.cache.get(data.ChannelID).send({ embeds: [embed] });
  } else return;
};
