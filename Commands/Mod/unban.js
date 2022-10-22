const discord = module.require("discord.js");

module.exports = {
  name: "unban",
  category: "moderation",
  description: "Unban anyone",
  usage: "unban <@user> <reason>",
  userPerms: ["BAN_MEMBERS"],
  botPerms: ["EMBED_LINKS", "BAN_MEMBERS"],
  run: async (client, message, args) => {
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "Unspecified";

    if(!args[0]) return message.reply(`please provide the userid to unban.`)

    try {
        let user = await message.guild.members.unban(args[0]);
        let embed = new discord.MessageEmbed()
        .setTitle("Action : Unban")
        .setDescription(`Unbanned ${args[0]} \nReason: ${reason}`)
        .setColor("#ff2050")
        .setFooter(`Unbanned by ${message.author.tag}`);
        return message.channel.send({ embeds: [embed]})
    } catch (error) {
        let errorembed = new discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`:x: **I couldn't unban the user or the user is not banned.**\n\n${error}`)
        return message.channel.send({embeds: [errorembed]})
    }
  },
};
