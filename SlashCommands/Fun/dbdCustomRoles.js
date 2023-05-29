const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "dbd",
  description:
    "Assigns roles of Killer, Survivor, and Spectator to players for a custom Dead by Daylight game.",
  options: [
    {
      name: "players",
      description:
        "Comma separated list of player usernames to be assigned roles.",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (client, interaction, args) => {
    let players = interaction.options
      .getString("players")
      .split(",")
      .map((player) => player.trim());

    players.sort(() => Math.random() - 0.5);

    let killer = players[0];
    let survivors = players.slice(1, 5);
    let spectators = players.slice(5);

    let embed = new EmbedBuilder()
      .setTitle("Dead by Daylight Role Assignment")
      .setColor("Random")
      .addFields(
        { name: "🔪**__Killer__**🗡️", value: killer, inline: false },
        {
          name: "🕵️**__Survivors__**",
          value: survivors.join("\n"),
          inline: false,
        },
        {
          name: "👀**__Spectators__**",
          value: spectators.join("\n") || "No spectators",
          inline: false,
        }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
