const roleData = require("../../database/guildData/roleupdates");
const { MessageEmbed } = require("discord.js");

module.exports = async (oldRole, newRole) => {
  let data;
  try {
    data = await roleData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}

  if (!data) return;

  if (newRole.name !== oldRole.name) {
    let nameEmbed = new MessageEmbed()
      .setTitle("Role Updates")
      .setDescription(`Updated ${newRole}`)
      .addField("Name", `${oldRole.name} => ${newRole.name}`)
      .setColor("GREEN")
      .setTimestamp();

    try {
      newRole.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [nameEmbed] });
    } catch (error) {}
  } else if (newRole.color !== oldRole.color) {
    let colorEmbed = new MessageEmbed()
      .setTitle("Role Updates")
      .setDescription(`Updated ${newRole}`)
      .addField("Color", `${oldRole.hexColor} => ${newRole.hexColor}`)
      .setColor("GREEN")
      .setTimestamp();

    try {
      newRole.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [colorEmbed] });
    } catch (error) {}
  } else if (newRole.hoist !== oldRole.hoist) {
    let oldHoist = oldRole.hoist ? "Yes" : "No";
    let newHoist = newRole.hoist ? "Yes" : "No";
    let hoistEmbed = new MessageEmbed()
      .setTitle("Role Updates")
      .setDescription(`Updated ${newRole}`)
      .addField("Hoisted", `${oldHoist} => ${newHoist}`)
      .setColor("GREEN")
      .setTimestamp();

    try {
      newRole.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [hoistEmbed] });
    } catch (error) {}
  } else if (newRole.mentionable !== oldRole.mentionable) {
    let oldMentionable = oldRole.mentionable ? "Yes" : "No";
    let newMentionable = newRole.mentionable ? "Yes" : "No";
    let mentionableEmbed = new MessageEmbed()
      .setTitle("Role Updates")
      .setDescription(`Updated ${newRole}`)
      .addField("Mentionable", `${oldMentionable} => ${newMentionable}`)
      .setColor("GREEN")
      .setTimestamp();

    try {
      newRole.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [mentionableEmbed] });
    } catch (error) {}
  }
};
