const Discord = require("discord.js");

module.exports = {
  name: "invite",
  description: "Get the bot's",
  botPerms: ["EMBED_LINKS"],
  run: async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
      .setTitle("Invite Me")
      .setColor("RANDOM")
      .setDescription(
        "**Get Infinity's Invite Link [Here](https://discord.com/api/oauth2/authorize?client_id=445804741432442900&permissions=8&scope=applications.commands%20bot)**"
      )
      .setFooter(`Requested By: ${message.author.username}`);
    message.channel.send({ embeds: [embed] });
  },
};
