const manageDB = require("../../functions/hourbooster/database");

const database = manageDB.read();

module.exports = {
  name: "accountcount",
  description:
    "Display the total number of Steam accounts in the database (Bot Owner only)",
  botPerms: [],
  userPerms: [],
  ownerOnly: true,
  options: [],
  run: async (client, interaction, args) => {
    const accountCount = database.length;
    interaction.reply({
      content: `There are currently ${accountCount} Steam accounts in the database.`,
      ephemeral: true,
    });
  },
};
