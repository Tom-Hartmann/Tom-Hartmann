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
    .setTitle("Member Unbanned")
    .setDescription(
      `User: ${member.user.tag} (${member})\nUser ID: ${member.id}\nAcc Created On: ${member.user.createdAt}`
    )
    .setColor("Green")
    .setTimestamp();

  try {
    member.guild.channels.cache.get(data.ChannelID).send({ embeds: [embed] });
  } catch (error) {}
};
