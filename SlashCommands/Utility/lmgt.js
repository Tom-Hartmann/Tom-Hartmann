module.exports = {
  name: "lmgt",
  description: "Sends a link to a user that is to lazy to google",
  options: [
    {
      name: "letmegooglethat",
      description: 'What to search via "Let Me Google That"',
      type: "STRING",
      required: "true",
    },
    {
      name: "member",
      description: "Member to timeout",
      type: "USER",
      required: "false",
    },
  ],
  run: async (client, interaction, args) => {
    const member = interaction.options.getMember("member");
    const reason = interaction.options.getString("letmegooglethat");

    var replaceMultipleSpacesWithSingleSpaces = reason
      .replace(/ +/g, " ")
      .replace(/\s+/g, "+");
    var url =
      "https://letmegooglethat.com/?q=" +
      `${replaceMultipleSpacesWithSingleSpaces}`;
    if (member) {
      interaction.reply(`${member} check this out: ${url}`);
    } else {
      interaction.reply(url);
    }
  },
};
