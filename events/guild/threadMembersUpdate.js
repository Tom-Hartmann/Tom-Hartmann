const { MessageEmbed } = require("discord.js");
const channelData = require("../../database/guildData/channelupdates");

module.exports = async (oldThreadMembers, newThreadMembers) => {
  let data;
  try {
    data = await channelData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}

  if (!data) return;

  if (oldThreadMembers.size < newThreadMembers.size) {
    const memberJoinEmbed = new MessageEmbed()
      .setTitle(`${oldThreadMembers.thread.name}`)
      .addField(
        "Thread Member Count Updated",
        `${oldThreadMembers.size} => ${newThreadMembers.size}`
      )
      .setColor("GREEN")
      .setTimestamp();

    try {
      newThread.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [memberJoinEmbed] });
    } catch (error) {}
  } else if (oldThreadMembers.size > newThreadMembers.size) {
    let memberLeftEmbed = new MessageEmbed()
      .setTitle(`${oldThreadMembers.thread.name}`)
      .addField(
        "Thread Member Count Updated",
        `${oldThreadMembers.size} => ${newThreadMembers.size}`
      )
      .setColor("GREEN")
      .setTimestamp();

    try {
      newThread.guild.channels.cache
        .get(data.ChannelID)
        .send({ embeds: [memberLeftEmbed] });
    } catch (error) {}
  }
};
