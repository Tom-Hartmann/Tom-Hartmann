const roleData = require("../../database/guildData/roleupdates");
const { EmbedBuilder } = require("discord.js");

module.exports = async (role) => {
  let data;
  try {
    data = await roleData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}

  if (!data) return;

  const embed = new EmbedBuilder()
    .setTitle("Role Created")
    .setDescription(
      `Role Name: ${role.name}\nRole ID: ${role.id}\nHoisted: ${
        role.hoisted ? "Yes" : "No"
      }\nMentionable: ${role.mentionable ? "Yes" : "No"}`
    )
    .setColor("GREEN")
    .setTimestamp();

  try {
    role.guild.channels.cache.get(data.ChannelID).send({ embeds: [embed] });
  } catch (error) {}
};
