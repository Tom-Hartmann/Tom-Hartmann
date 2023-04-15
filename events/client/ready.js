const chalk = require("chalk");
const cron = require("node-cron");
const { Guild, Ban } = require("../../database/guildData/tempbanRoles");
const { ActivityType } = require("discord.js");
const mongoose = require("mongoose");
const steamidle = require('../../functions/hourbooster/app')
var os = require("os-utils");
const { mongoPass } = require("../../config.json");
module.exports = (client) => {
  const guildin = client.guilds.cache.size;
  const guildmember = client.users.cache.size;

  client.user.setPresence({ status: "online" });
  let textList = [
    " About handling command",
    " in: " + guildin + " Server." + "Serving: " + guildmember + " member",
    `Current Cpu core : ${os.cpuCount()}`,
  ];
  client.user.setPresence({ status: "online" });
  setInterval(() => {
    var text = textList[Math.floor(Math.random() * textList.length)];
    client.user.setActivity(text, { type: ActivityType.Watching });
  }, 3000);

  let allMembers = new Set();
  client.guilds.cache.forEach((guild) => {
    guild.members.cache.forEach((member) => {
      allMembers.add(member.user.id);
    });
  });

  let allChannels = new Set();
  client.guilds.cache.forEach((guild) => {
    guild.channels.cache.forEach((channel) => {
      allChannels.add(channel.id);
    });
  });
  console.log(
    chalk.bgMagentaBright.black(` ${client.guilds.cache.size} servers `),
    chalk.bgMagentaBright.black(` ${client.channels.cache.size} channels `),
    chalk.bgMagentaBright.black(` ${allMembers.size} members `),
    chalk.bgMagentaBright.black(` ${client.commands.size} Commands `),
    chalk.bgMagentaBright.black(` ${client.slash.size} Slash `)
  );

  mongoose
    .connect(mongoPass)
    .then(
      console.log(
        chalk.bgGreenBright.black(
          ` ${client.user.username} connected to Mongo DB `
        )
      )
    )
    .catch((err) =>
      console.log(
        chalk.bgRedBright.black(
          ` ${client.user.username} could not connect to mongo DB `,
          err
        )
      )
    );
  cron.schedule("*/5 * * * *", async () => {
    const expiredBans = await Ban.find({ expiresAt: { $lt: Date.now() } });
    for (const ban of expiredBans) {
      try {
        const guild = await Guild.findOne({ GuildID: ban.GuildID });
        await guild.guild.unban(ban.User, "Ban expired");
        //await ban.remove() not needed, we still need to return roles
        console.log(`Unbanned ${ban.User} from ${ban.GuildID}`);
      } catch (err) {
        console.log(`Failed to unban ${ban.User} from ${ban.GuildID}`, err);
      }
    }
  });
};
