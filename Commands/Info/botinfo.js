const Discord = require("discord.js");
const moment = require("moment");
const config = require('../../config.json');
const { uptime } = require("process");
require("moment-duration-format");
module.exports = {
  name: "botinfo",
  description: "Shows the bot info",
  botPerms: ["EMBED_LINKS"],
  run: async (client, message, args) => {
    const duration = moment
      .duration(client.uptime)
      .format(" D [days], H [hrs], m [mins], s [secs]");

    let embed = new Discord.MessageEmbed()
      .setAuthor(`${client.user.username}'s Info`, client.user.avatarURL())
      .setColor("RANDOM")
      .setDescription(
        `**Bot Name: **${client.user.username} \n**Owner: **${config.OWNER_USERNAME} \n**Total Categories: **8 \n**Total Commands: **${client.commands.size} \n**Users:** ${
          client.users.cache.size
        } \n**Servers:** ${client.guilds.cache.size} \n**Channels:** ${
          client.channels.cache.size
        }\n**Uptime:** ${duration}`
      )
      .addField(
        `About ${client.user.username}`,
        `${client.user.username} is an more or less open-source multi-purpose discord bot with features like moderation, music, logging, welcomer and so much more!`
      )
      .setFooter(`Regards, ${config.OWNER_USERNAME}`);
    message.channel.send({ embeds: [embed] });
  },
};
