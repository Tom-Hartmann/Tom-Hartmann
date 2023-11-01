const discord = require("discord.js");

module.exports = {
  name: "ping",
  description: "Get the bot's ping!",
  options: null,
  run: async (client, interaction, args) => {

    let start = Date.now();

    let embed1 = new discord.EmbedBuilder()
    .setDescription("Looks like the bot is slow.")
    .setColor("Random")

    await interaction.reply({
        embeds: [embed1]
      })
        let end = Date.now();

        let embed = new discord.EmbedBuilder()
          .setTitle("Ping!")
          .setDescription("API Latency", `${Math.round(client.ws.ping)}ms`,`Message Latency, ${end - start}ms`)
          .setColor("Random");

       interaction.editReply({ embeds: [embed] }).catch((e) => interaction.followUp(e));
  },
};
