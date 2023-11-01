const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "timer",
  description: "Set a timer and get notified when it's over",
  options: [
    {
      name: "duration",
      description: "Duration of the timer in seconds",
      required: true,
      type: ApplicationCommandOptionType.INTEGER,
    },
  ],
  run: async (client, interaction, args) => {
    const { duration } = args[0];

    if (duration <= 0) {
      return interaction.reply(
        "Please enter a positive duration for the timer."
      );
    }

    // Convert seconds to milliseconds
    const durationMs = duration * 1000;

    interaction.reply(`Timer set for ${duration} seconds.`);

    // Set a timer to notify the user
    setTimeout(() => {
      interaction.followUp("Timer is over!");
    }, durationMs);
  },
};
