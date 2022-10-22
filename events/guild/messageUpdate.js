const messageData = require("../../database/guildData/messagelogs");
const HartmannEmbed = require("../../functions/embeds/Hartmannembed");
const {
  Util: { escapeMarkdown },
} = require("discord.js");
const { diffWordsWithSpace } = require("diff");

module.exports = async (old, message) => {
  const data = await messageData.findOne({
    GuildID: message.guild.id,
  });

  if (!data) return;

  const channel = data.ChannelID;
  const sendtoChannel = message.guild.channels.cache.get(channel);
  if (!sendtoChannel) return;
  if (!message.guild || old.content === message.content || message.author.bot)
    return;

  const embed = new HartmannEmbed()
    .setColor("BLUE")
    .setAuthor({
      name: `${old.author.tag}`,
      iconURL: `${message.author.avatarURL({ dynamic: true, size: 512 })}`,
    })
    .setTitle("Message Updated")
    .setDescription(
      `
      **❯ Message ID:** ${old.id}
      **❯ Channel:** ${old.channel}
      **❯ Author:** ${old.author.tag} (${old.author.id})
    `
    )
    .setURL(old.url)
    .splitFields(
      diffWordsWithSpace(
        escapeMarkdown(old.content),
        escapeMarkdown(message.content)
      )
        .map((result) =>
          result.added
            ? `**${result.value}**`
            : result.removed
            ? `~~${result.value}~~`
            : result.value
        )
        .join(" ")
    );
  sendtoChannel.send({ embeds: [embed] });
};
