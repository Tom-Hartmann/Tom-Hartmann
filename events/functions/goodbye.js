const byeData = require("../../database/guildData/leavechannel");
const byemsg = require("../../database/guildData/leavemessage");
const { MessageEmbed } = require("discord.js");

module.exports = async (member) => {
  const avatar = member.user.avatarURL;
  let data;
  let data2;
  try {
    data = await byeData.findOne({
      GuildID: member.guild.id,
    });
  } catch (error) {}
  if (data) {
    try {
      data2 = await byemsg.findOne({
        GuildID: member.guild.id,
      });
    } catch (error) {}
    if (data2) {
      var leavemessage = data2.ByeMsg;

      leavemessage = leavemessage.replace("{user.mention}", `${member}`);
      leavemessage = leavemessage.replace("{user.name}", `${member.user.tag}`);
      leavemessage = leavemessage.replace("{server}", `${member.guild.name}`);
      leavemessage = leavemessage.replace(
        "{membercount}",
        `${member.guild.memberCount}`
      );

      let embed = new MessageEmbed()
        .setDescription(`${leavemessage}`)
        .setColor("Green");

      let channel = data.Bye;

      try {
        member.guild.channels.cache.get(channel).send({ embeds: [embed] });
      } catch (error) {}
    } else if (!data2) {
      let embed2 = new MessageEmbed()
        .setTitle("Goodbye")
        .setThumbnail(member.user.avatarURL())
        .setDescription(
          `**${member.user.tag}** just left the server! We hope they return back soon!`
        )
        .setFooter(`We now have ${member.guild.memberCount} members!`)
        .setThumbnail(member.user.avatarURL())
        .setColor("Green");

      let byechannel = data.Bye;

      try {
        member.guild.channels.cache.get(byechannel).send({ embeds: [embed2] });
      } catch (error) {}
    }
  }
};
