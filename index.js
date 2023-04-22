const fs = require("fs");
const chalk = require("chalk");

const {
  Client,
  Collection,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");
const {
  DEFAULT_PREFIX,
  BOT_TOKEN,
  ERROR_LOGS_CHANNEL,
  YT_COOKIE,
} = require("./config.json");
const { loadCommands } = require("./handler/loadCommands");
const { loadEvents } = require("./handler/loadEvents");
const { loadSlashCommands } = require("./handler/loadSlashCommands");
const { loadPlayerEvents } = require("./handler/loadPlayerEvents");
const { DiscordTogether } = require("discord-together");
const { Player } = require("discord-player");
const intervalInMillisecons = 5 * 60 * 1000; // 5 Min
const manageDB = require("./functions/hourbooster/database");
const Enmap = require("enmap");

const client = new Client({
  allowedMentions: { parse: ["users", "roles"] },
  intents: 47007,
});
const { checkValid } = require("./functions/validation/checkValid");
const Embeds = require("./functions/embeds/Embeds");
const Logger = require("./functions/Logger/Logger");
const Util = require("./functions/util/Util");

client.discordTogether = new DiscordTogether(client);
client.commands = new Collection();
client.slash = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./Commands/");
client.setMaxListeners(0);
const Cookie = YT_COOKIE;
client.logger = Logger;
client.utils = Util;
client.say = Embeds;
const player = new Player(client, {
  leaveOnEnd: true,
  leaveOnStop: true,
  leaveOnEmpty: false,
  leaveOnEmptyCooldown: 60000,
  autoSelfDeaf: true,
  initialVolume: 50,
  ytdlDownloadOptions: {
    requestOptions: {
      headers: {
        cookie: Cookie,
      },
    },
  },
});

client.player = player;
client.db = new Enmap({ name: "musicdb" });

const database = manageDB.read();

loadCommands(client);
loadEvents(client);
loadPlayerEvents(client);
loadSlashCommands(client);
checkValid();
// Error Handling

process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught Exception:", err);

  const nodeModulesError = err.stack.includes("node_modules");
  if (!nodeModulesError) {
    console.error("Stack trace:", err.stack);
    const description = err.toString().substring(0, 100); // Truncate the error message to 100 characters
    const exceptionembed = new EmbedBuilder()
      .setTitle("Uncaught Exception")
      .setDescription(description)
      .addFields({ name: "Stack Trace", value: `\`\`\`${err.stack}\`\`\`` })
      .setColor("Red");
    client.channels.cache
      .get(ERROR_LOGS_CHANNEL)
      .send({ embeds: [exceptionembed] });
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("[FATAL] Unhandled Promise Rejection at:", promise);

  const nodeModulesError = reason.stack.includes("node_modules");
  if (!nodeModulesError) {
    console.error("Reason:", reason);
    console.error("Stack trace:", reason.stack);
    const description = reason.message.substring(0, 100); // Truncate the reason message to 100 characters
    const rejectionembed = new EmbedBuilder()
      .setTitle("Unhandled Promise Rejection")
      .addFields([
        { name: "Promise", value: `${promise}` },
        { name: "Reason", value: description },
        { name: "Stack Trace", value: `\`\`\`${reason.stack}\`\`\`` },
      ])
      .setColor("Red");
    client.channels.cache
      .get(ERROR_LOGS_CHANNEL)
      .send({ embeds: [rejectionembed] });
  }
});

client.login(BOT_TOKEN).then(() => {
  console.log(
    chalk.bgBlueBright.black(` Successfully logged in as: ${client.user.tag}`)
  );
});

if (database.length === 0) {
  console.error("[!] No accounts have been added!");
  return;
} else {
  setTimeout(function () {
    if (database.length === 0) return;
    const steamHour = require("./functions/hourbooster/app.js");
    steamHour.startBoost();
  }, 8000); // 5000 milliseconds = 5 seconds
}
