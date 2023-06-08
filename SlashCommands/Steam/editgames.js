const { ApplicationCommandOptionType } = require("discord.js");
const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");
const migrate = require("../../functions/hourbooster/migrate");
const manageDB = require("../../functions/hourbooster/database");
const axios = require("axios");
const { STEAM_API } = require("../../config.json");

migrate();
const database = manageDB.read();

module.exports = {
  name: "editgames",
  description:
    "Edit the list of boosted games on Steam\nThis will replace the current boosted games with a new list!",
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
      name: "games",
      description: "Comma-separated list of new game ID's to boost",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    const username = await interaction.options.getString("username");
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

    let index = database.findIndex(
      (entry) =>
        entry.name === username && entry.discordUserId === discordUserId
    );

    if (index === -1) {
      return interaction.followUp({
        content:
          "You haven't set up any game boosting for this account yet. Use the boost command first.",
        ephemeral: true,
      });
    } else {
      // Update the games list
      database[index].games = games;
      manageDB.write(database);
      interaction.followUp({
        content: "Successfully updated game list.",
        ephemeral: true,
      });
    }
  },
};
