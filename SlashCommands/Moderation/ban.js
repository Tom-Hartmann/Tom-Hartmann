module.exports = {
  name: "ban",
  description: "Ban users.",
  botPerms: ["BAN_MEMBERS"],
  userPerms: ["BAN_MEMBERS"],
  options: [
    {
      name: "member",
      description: "Member to ban",
      type: "USER",
      required: "true",
    },
    {
      name: "reason",
      description: "A reason for the ban",
      type: "STRING",
      required: "false",
    },
  ],
  run: async (interaction) => {
    const member = interaction.options.getMember("member");
    let reason = interaction.options.getString("reason");
    if (!reason) {
      reason = `Banned by ${interaction.user.username}`;
    }
    console.log(reason);
    const response = await member.ban({ deleteMessageDays: 7, reason: reason });
    if (!response)
      return interaction.followUp({
        content:
          "I am sorry but for some reason I am unable to ban this member.",
      });
    return interaction.followUp({ content: `${member} has been banned.` });
  },
};
