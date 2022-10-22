const messageData = require("../../database/guildData/messagelogs");
const { MessageEmbed, Util } = require("discord.js");

module.exports = async (message) => {
  if (message.author.bot) return;
  const data = await messageData.findOne({
    GuildID: message.guild.id,
  });
  if (!data) return;

  const channel = data.ChannelID;
  const sendtoChannel = message.guild.channels.cache.get(channel);
  if (!sendtoChannel) return;

  const messageDeleteEmbed = new MessageEmbed()
    .setColor("ORANGE")
    .setAuthor({
      name: `Message Deleted in #${message.channel.name}`,
      iconURL: `${message.author.avatarURL({ dynamic: true, size: 512 })}`,
    })
    .setDescription(
      `**${message.author.username}\'s** message was deleted in ${
        message.channel
      }\n**Content:** ${Util.escapeMarkdown(message.content)}`
    );
  sendtoChannel.send({ embeds: [messageDeleteEmbed] });
};
