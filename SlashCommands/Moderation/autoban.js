const { OWNER_ID } = require("../../config.json");

module.exports = {
  name: "autoban",
  description: "Ban users.",
  botPerms: ["BAN_MEMBERS"],
  userPerms: ["BAN_MEMBERS"],
  options: [
    {
      name: "memberid",
      description: "Member to ban once joined to the guild",
      type: "INTEGER",
      required: "true",
    },
  ],
  run: async (interaction) => {
    const dude = interaction.options.getInteger("memberid");
    const reason = `${interaction.user.id} Added to ban the user.`;
    const fetchDute = interaction.guild.members.fetch(dude);
    let global = false;
    if (interaction.user.id === OWNER_ID) {
      global = true;
    }
    if (fetchDute) {
      try {
        fetchDute.ban({ deleteMessageDays: 7, reason: reason });
      } catch (error) {
        console.log(`${error} at autoban in Slashcommands`);
      }
    }

    return interaction.followUp({ content: `` });
  },
};
