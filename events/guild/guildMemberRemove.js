const memberData = require("../../database/guildData/memberupdates");
const { EmbedBuilder } = require("discord.js");

module.exports = async (member) => {
  let data;
  try {
    data = await memberData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}

  if (!data) return;

  const embed = new EmbedBuilder()
    .setTitle("Member Left")
    .setDescription(
      `User: ${member.user.tag} (${member})\nUser ID: ${member.id}\nAcc. Created: ${member.user.createdAt}\nServer Mmebr Count: ${member.guild.memberCount}`
    )
    .setColor("Green")
    .setTimestamp()
    .setThumbnail(`${member.user.avatarURL}`);

  try {
    member.guild.channels.cache.get(data.ChannelID).send({ embeds: [embed] });
  } catch (error) {}
};
