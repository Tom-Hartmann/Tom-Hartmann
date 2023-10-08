const chalk = require("chalk");
const cron = require("node-cron");
const { ERROR_LOGS_CHANNEL } = require("../../config.json");
const { Guild, Ban } = require("../../database/guildData/tempbanRoles");
const { ActivityType } = require("discord.js");
const mongoose = require("mongoose");
const steamidle = require("../../functions/hourbooster/app");
var os = require("os-utils");
const { mongoPass } = require("../../config.json");
module.exports = (client) => {
  const guildin = client.guilds.cache.size;
  let totalMembers = 0;

  client.guilds.cache.forEach((guild) => {
    totalMembers += guild.memberCount;
  });

  client.user.setPresence({ status: "online" });
  let textList = [
    " About handling command",
    " in: " + guildin + " Server." + "Serving: " + totalMembers + " member",
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
  async function checkAutoBans() {
    const autobans = await autobanData.find();
    for (const autoban of autobans) {
      const targetUser = autoban.UserID;

      // Check if the ban is global or specific
      const guildsToCheck = autoban.Global
        ? client.guilds.cache.array()
        : [client.guilds.cache.get(autoban.GuildID)];

      for (const guild of guildsToCheck) {
        const member = guild.members.cache.get(targetUser);

        // Check if user is present in the guild
        if (member) {
          // Check if the bot has permission to ban in the guild
          const botMember = guild.members.cache.get(client.user.id);
          if (botMember && botMember.hasPermission("BAN_MEMBERS")) {
            try {
              await member.ban({ reason: autoban.Reason });
              console.log(
                `Banned ${targetUser} from ${guild.id} due to autoban.`
              );

              // Send a log message to the error channel
              const logChannel = guild.channels.cache.get(ERROR_LOGS_CHANNEL);
              if (logChannel && logChannel.isText()) {
                logChannel.send(
                  `Successfully autobanned ${member.user.tag} (${targetUser}) from ${guild.name}(${guild.id}) due to reason: ${autoban.Reason}.`
                );
              }
            } catch (err) {
              console.log(`Failed to ban ${targetUser} from ${guild.id}.`, err);
            }
          }
        }
      }
    }
  }

  // Run the check immediately after bot starts
  checkAutoBans();

  // Schedule the check every X time (e.g., every hour)
  cron.schedule("*/30 * * * *", checkAutoBans);
};
