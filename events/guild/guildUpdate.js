const serverData = require("../../database/guildData/serverupdates");
const { MessageEmbed } = require("discord.js");

module.exports = async (oldGuild, newGuild) => {
  let data;
  try {
    data = await serverData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}

  if (!data) return;

  if (newGuild.name !== oldGuild.name) {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Server Updates")
      .addField("Server Name Changed", `${oldGuild.name} => ${newGuild.name}`)
      .setThumbnail(`${newGuild.iconURL()}`)
      .setTimestamp();

    try {
      newGuild.channels.cache.get(data.ChannelID).send({ embeds: [embed] });
    } catch (error) {}
  } else if (newGuild.iconURL() !== oldGuild.iconURL()) {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Server Updates")
      .addField(
        "Server Icon Changed",
        `[Old Icon](${oldGuild.iconURL()}) => [New Icon](${newGuild.iconURL()})`
      )
      .setThumbnail(`${newGuild.iconURL()}`)
      .setTimestamp();

    try {
      newGuild.channels.cache.get(data.ChannelID).send({ embeds: [embed] });
    } catch (error) {}
  } else if (newGuild.splashURL() !== oldGuild.splashURL()) {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Server Updates")
      .addField(
        "Server Splash Changed",
        `[Old Splash](${oldGuild.splashURL()}) => [New Splash](${newGuild.splashURL()})`
      )
      .setThumbnail(`${newGuild.splashURL()}`)
      .setTimestamp();

    try {
      newGuild.channels.cache.get(data.ChannelID).send({ embeds: [embed] });
    } catch (error) {}
  } else if (newGuild.memberCount !== oldGuild.memberCount) {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Server Updates")
      .addField(
        "Server Members Changed",
        `${oldGuild.memberCount} => ${newGuild.memberCount}`
      )
      .setThumbnail(`${newGuild.iconURL()}`)
      .setTimestamp();

    try {
      newGuild.channels.cache.get(data.ChannelID).send({ embeds: [embed] });
    } catch (error) {}
  } else if (newGuild.ownerId !== oldGuild.ownerId) {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Server Updates")
      .addField(
        "Server Owner Changed",
        `${oldGuild.owner.user.username} => ${newGuild.owner.user.username}`
      )
      .setThumbnail(`${newGuild.iconURL()}`)
      .setTimestamp();

    try {
      newGuild.channels.cache.get(data.ChannelID).send({ embeds: [embed] });
    } catch (error) {}
  } else {
    return;
  }
};
