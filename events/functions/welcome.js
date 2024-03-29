const welcomeData = require("../../database/guildData/welcome");
const welcomemsg = require("../../database/guildData/joinmsg");
const { EmbedBuilder } = require("discord.js");

module.exports = async (member) => {
  const avatar = member.user.avatarURL;
  let data;
  let data2;
  try {
    data = await welcomeData.findOne({
      GuildID: member.guild.id,
    });
  } catch (error) {}
  if (data) {
    try {
      data2 = await welcomemsg.findOne({
        GuildID: member.guild.id,
      });
    } catch (error) {}
    if (data2) {
      var joinmessage = data2.JoinMsg;

      joinmessage = joinmessage.replace("{user.mention}", `${member}`);
      joinmessage = joinmessage.replace("{user.name}", `${member.user.tag}`);
      joinmessage = joinmessage.replace("{server}", `${member.guild.name}`);
      joinmessage = joinmessage.replace(
        "{membercount}",
        `${member.guild.memberCount}`
      );

      let embed = new EmbedBuilder()
        .setDescription(joinmessage)
        .setColor("GREEN");

      let channel = data.Welcome;

      try {
        member.guild.channels.cache.get(channel).send({ embeds: [embed] });
      } catch (error) {}
    } else if (!data2) {
      let embed2 = new EmbedBuilder()
        .setTitle("Welcome")
        .setDescription(
          `${member}, Welcome to **${member.guild.name}**! We hope you like our Server! Enjoy Your Stay here!`
        )
        .setFooter({text:`We are now ${member.guild.memberCount} members`})
        .setColor("Green");

      let channel = data.Welcome;

      try {
        member.guild.channels.cache.get(channel).send({ embeds: [embed2] });
      } catch (error) {}
    }
  }
};
