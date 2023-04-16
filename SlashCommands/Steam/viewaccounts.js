const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
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

function maskUsername(username) {
  const length = username.length;
  let maskCount;

  if (length >= 3 && length < 6) {
    maskCount = 2;
  } else if (length >= 6 && length < 10) {
    maskCount = 4;
  } else if (length >= 10 && length < 16) {
    maskCount = 6;
  } else if (length >= 16) {
    maskCount = 12;
  } else {
    maskCount = 0;
  }

  const maskedPart = "\\*".repeat(maskCount);
  const visiblePart = username.slice(0, -maskCount);
  return visiblePart + maskedPart;
}

async function sendEmbed(interaction, embed) {
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function sendFollowUp(interaction, embed) {
  await interaction.followUp({ embeds: [embed], ephemeral: true });
}

module.exports = {
  name: "viewaccounts",
  description: "View your Steam accounts linked to your Discord user",
  botPerms: [],
  userPerms: [],
  options: [
    {
      type: ApplicationCommandOptionType.Boolean,
      name: "mask",
      description: "Do you want to mask the usernames?",
      required: false,
    },
  ],
  run: async (client, interaction, args) => {
    const discordUserId = interaction.user.id;
    const maskUsernames = interaction.options.getBoolean("mask") ?? false;

    const userAccounts = database.filter(
      (entry) => entry.discordUserId === discordUserId
    );

    if (userAccounts.length === 0) {
      return interaction.reply({
        content: "You have no linked Steam accounts.",
        ephemeral: true,
      });
    }

    let embed = new EmbedBuilder()
      .setTitle("Your linked Steam accounts to be hourboosted")
      .setColor("#0099ff");

    let firstEmbedSent = false;

    const apiKey = STEAM_API;

    for (const [index, account] of userAccounts.entries()) {
      const maskedUsername = maskUsernames
        ? maskUsername(account.name)
        : account.name;

      const gameList = await Promise.all(
        account.games.map(async (gameId) => {
          const gameName = await getGameName(gameId, apiKey);
          return `${gameId} (**${gameName}**)`;
        })
      );

      const fieldValue = `Username: ${maskedUsername}\nGames:\n${gameList.join(
        ",\n"
      )}`;

      if (embed.length + fieldValue.length > 6000) {
        if (!firstEmbedSent) {
          await sendEmbed(interaction, embed);
          firstEmbedSent = true;
        } else {
          await sendFollowUp(interaction, embed);
        }

        embed = new EmbedBuilder()
          .setTitle("Your linked Steam accounts (continued)")
          .setColor("#0099ff");
      }

      embed.addFields({
        name: `Account ${index + 1}`,
        value: fieldValue,
      });
    }

    if (!firstEmbedSent) {
      await sendEmbed(interaction, embed);
    } else {
      await sendFollowUp(interaction, embed);
    }
  },
};
