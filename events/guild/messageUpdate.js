const messageData = require("../../database/guildData/messagelogs");
const { EmbedBuilder } = require("discord.js");

module.exports = async (oldMessage, newMessage) => {
  let data;
  try {
    data = await messageData.findOne({
      GuildID: channel.guild.id,
    });
  } catch (error) {}

  if (!data) return;

  const channel = data.ChannelID;

  const embed = new EmbedBuilder()
    .setTitle("Message Edited")
    .addFields({
      name: "Jump to Message",
      value: `[Click Me](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`,
    })
    .addFields({ name: `Old Message`, value: `${oldMessage.content}` }, true)
    .addFields({ name: "New Message", value: `${newMessage.content}` }, true)
    .setDescription(
      `${newMessage.author} edited their message in ${newMessage.channel}`
    )
    .setColor("GREEN")
    .setTimestamp();

  try {
    newMessage.guild.channels.cache
      .get(data.ChannelID)
      .send({ embeds: [embed] });
  } catch (error) {}
};
