const { ApplicationCommandOptionType } = require("discord.js");
const manageDB = require("../../functions/hourbooster/database");
const migrate = require("../../functions/hourbooster/migrate");
const { tryCatch } = require("ramda");

migrate();
const database = manageDB.read();

module.exports = {
  name: "remove",
  description: "Remove Steam account from the boost list",
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
  ],
  run: async (client, interaction, args) => {
    try {
      const username = await interaction.options.getString("username");
      const discordUserId = await interaction.user.id; 

      await interaction.reply({
        content: "Trying to remove the account from the list, please wait...",
        ephemeral: true,
      });
      let index = database.findIndex(
        (entry) =>
          entry.name === username && entry.discordUserId === discordUserId
      );
      if (index === -1) {
        return interaction.followUp({
          content:
            "Sorry, we couldn't find a record for this username linked to your Discord user.",
          ephemeral: true,
        });
      }
      
    database.splice(index, 1);
    manageDB.write(database);

    return interaction.followUp({
      content: `Successfully removed account '${username}' from the list.`,
      ephemeral: true,
    });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};
