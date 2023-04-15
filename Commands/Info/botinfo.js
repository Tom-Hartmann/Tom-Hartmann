const Discord = require("discord.js");
const moment = require("moment");
const config = require("../../config.json");
require("moment-duration-format");
module.exports = {
  name: "botinfo",
  description: "Shows the bot info",
  botPerms: ["EmbedLinks"],
  run: async (client, message, args) => {
    const duration = moment
      .duration(client.uptime)
      .format(" D [days], H [hrs], m [mins], s [secs]");

    let embed = new Discord.EmbedBuilder()
      .setTitle(`${config.OWNER_USERNAME}'s Info`)
      .setColor("Random")
      .setDescription(
        `**Bot Name: **${client.user.username} \n**Owner: **${config.OWNER_USERNAME} \n**Total Categories: **8 \n**Total Commands: **${client.commands.size} Total Slash Commands: ${client.slash.size} \n**Users:** ${client.users.cache.size} \n**Servers:** ${client.guilds.cache.size} \n**Channels:** ${client.channels.cache.size} \n**Uptime:** ${duration}`
      )
      .addFields([
        {
          name: `${client.user.username}`,
          value: `${client.user.username} is an open-source multi-purpose discord bot with features like moderation, music, logging, welcomer and so much more!`,
        },
      ]);
    message.channel.send({ embeds: [embed] });
  },
};
