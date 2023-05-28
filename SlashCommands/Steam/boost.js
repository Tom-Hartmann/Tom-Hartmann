const { ApplicationCommandOptionType } = require("discord.js");
const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");
const migrate = require("../../functions/hourbooster/migrate");
const manageDB = require("../../functions/hourbooster/database");
const axios = require("axios");
const { STEAM_API } = require("../../config.json");

migrate();
const database = manageDB.read();

async function isGameValid(appId, apiKey) {
  try {
    const response = await axios.get(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&key=${apiKey}`
    );
    return response.data[appId] && response.data[appId].success;
  } catch (error) {
    console.error("Error fetching game details:", error);
    return false;
  }
}

module.exports = {
  name: "boost",
  description:
    "Boost games on Steam\nDO NOT USE THIS COMMAND IN A GUILD(Server)\nALWAYS USE IT IN DMS WITH THIS BOT",
  botPerms: [],
  userPerms: [],
  ownerOnly: false,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "username",
      description: "Your Steam username",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "password",
      description: "Your Steam password",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "games",
      description: "Comma-seperated list of game ID's to boost",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    const username = await interaction.options.getString("username");
    const password = await interaction.options.getString("password");
    const gamesInput = await interaction.options.getString("games");
    const discordUserId = await interaction.user.id;
    const games = gamesInput
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => id);

    interaction.reply({
      content:
        "Thanks for the Infos! Give me a second to validate the information.",
      ephemeral: true,
    });
    // Validate and convert the input to an array of integers
    if (!/^\d+(,\d+)*$/.test(games)) {
      return interaction.followUp({
        content:
          "Invalid game IDs. Please provide a comma-separated list of numeric game IDs.",
        ephemeral: true,
      });
    }

    //Adding Steam api
    const apiKey = STEAM_API;

    //check if the game id's are valid
    for (const gameId of games) {
      const isValid = await isGameValid(gameId, apiKey);
      if (!isValid) {
        return interaction.followUp({
          content: `Invalid game ID: ${gameId}. Please provide valid Steam game IDs.`,
          ephemeral: true,
        });
      }
      console.log(isValid);
    }
    let index = database.findIndex((entry) => entry.name === username);
    if (index === -1) {
      database.push({
        name: username,
        password,
        discordUserId,
      });
      index = database.findIndex((entry) => entry.name === username);
    } else {
      //Update UserID if its not already set or if its diffrent
      if (
        !database[index].discordUserId ||
        database[index].discordUserId !== discordUserId
      ) {
        database[index].discordUserId = discordUserId;
      }
    }

    const steam_client = new SteamUser();
    steam_client.setOption("promptSteamGuardCode", false);
    steam_client.setOption("dataDirectory", null);
    steam_client.logOn({
      accountName: username,
      password,
    });
    steam_client.on("steamGuard", async (domain, callback) => {
      if (domain) {
        await interaction.followUp({
          content: `Please provide Steam Guard code (${domain}):\nYou got 1minute to get the code.`,
          ephemeral: true,
        });
        const filter = (m) => m.author.id === interaction.user.id;
        const collected = await interaction.channel.awaitMessages({
          filter,
          max: 1,
          time: 60000,
          errors: ["time"],
        });
        const code = collected.first().content;
        callback(code);
        await interaction.followUp({
          content: `Thanks for providing the Steam Guard code!`,
          ephemeral: true,
        });
      } else {
        await interaction.followUp({
          content: "Please provide your two-factor shared secret:",
          ephemeral: true,
        });
        const filter = (m) => m.author.id === interaction.user.id;
        const collected = await interaction.channel.awaitMessages({
          filter,
          max: 1,
          time: 60000,
          errors: ["time"],
        });
        const secret = collected.first().content;
        SteamTotp.generateAuthCode(secret, (err, code) => {
          database[index].secret = secret;
          callback(code);
        });
      }
    });

    steam_client.on("sentry", (sentry) => {
      database[index].sentry = sentry.toString("base64");
      return manageDB.write(database);
    });
    steam_client.on("loggedOn", () => {
      database[index].password = password;
      database[index].games = games;
      manageDB.write(database);
      interaction.followUp({
        content: "Successfully logged in and updated game list.",
        ephemeral: true,
      });
    });
    steam_client.on("error", (err) => {
      console.log(`Error:  ${err}`);
      interaction.followUp({ content: `Error ${err}`, ephemeral: true });
    });
  },
};
