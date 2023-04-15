const { MessageEmbed, ApplicationCommandOptionType } = require("discord.js");
const manageDB = require("../../functions/hourbooster/database");
const { STEAM_API } = require("../../config.json");

const database = manageDB.read();

async function getGameName(gameId, apiKey) {
  const response = await fetch(
    `https://store.steampowered.com/api/appdetails?appids=${gameId}&key=${apiKey}`
  );
  const data = await response.json();
  return data[gameId].success ? data[gameId].data.name : "Unknown";
}

module.exports = {
  name: "viewaccounts",
  description: "View your Steam accounts linked to your Discord user",
  botPerms: [],
  userPerms: [],
  options: [],
  run: async (client, interaction, args) => {
    const discordUserId = interaction.user.id;

    const userAccounts = database.filter(
      (entry) => entry.discordUserId === discordUserId
    );

    if (userAccounts.length === 0) {
      return interaction.reply({
        content: "You have no linked Steam accounts.",
        ephemeral: true,
      });
    }

    const embed = new MessageEmbed()
      .setTitle("Your linked Steam accounts")
      .setColor("#0099ff");

    const apiKey = STEAM_API;

    for (const [index, account] of userAccounts.entries()) {
      const maskedUsername = account.name.replace(/(?<=.{3})./g, "*");
      const gameList = await Promise.all(
        account.games.map(async (gameId) => {
          const gameName = await getGameName(gameId, apiKey);
          return `${gameId} (${gameName})`;
        })
      );

      embed.addField(
        `Account ${index + 1}`,
        `Username: ${maskedUsername}\nPassword: *\nGames: ${gameList.join(
          ", "
        )}`
      );
    }

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
