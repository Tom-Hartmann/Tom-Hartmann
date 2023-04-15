const { MessageEmbed } = require("discord.js");
const channelData = require("../../database/guildData/channelupdates");

module.exports = async (oldThread, newThread) => {
  let data;
  try {
    data = await channelData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}

  if (!data) return;

  if (oldThread.name !== newThread.name) {
    const nameEmbed = new MessageEmbed()
      .setTitle(`${oldThread.name}`)
      .addField(
        "Thread Name Changed",
        `${oldThread.name} => ${newThread.name}`,
        true
      )
      .setColor("GREEN")
      .setTimestamp();

    try {
      newThread.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [nameEmbed] });
    } catch (error) {}
  } else if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
    let rateLimitEmbed = new MessageEmbed()
      .setTitle(`${oldThread.name}`)
      .addField(
        "Thread Slowmode Updated",
        `${oldThread.rateLimitPerUser} => ${newThread.rateLimitPerUser}`
      )
      .setColor("GREEN")
      .setTimestamp();

    try {
      newThread.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [rateLimitEmbed] });
    } catch (error) {}
  } else if (oldThread.locked !== newThread.locked) {
    let archivedEmbed = new MessageEmbed()
      .setTitle(`${oldThread.name}`)
      .addField(
        "Thread Archive Status Changed",
        `${oldThread.locked ? "Yes" : "No"} => ${
          newThread.locked ? "Yes" : "No"
        }`
      )
      .setColor("GREEN")
      .setTimestamp();

    try {
      newThread.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [archivedEmbed] });
    } catch (error) {}
  }
};
