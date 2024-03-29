const automodData = require("../../../database/guildData/antiwords");

module.exports = async (interaction, client) => {
  if (!interaction.isStringSelectMenu()) return;
  let msg = await interaction.channel.messages.fetch(interaction.message.id);
  if (interaction.values[0] === "automod") {
    let data;
    try {
      data = await automodData.findOne({
        GuildID: interaction.guild.id,
      });
    } catch (error) {}

    if (!data) {
      let newData = new automodData({
        GuildID: interaction.guild.id,
      });

      newData.save();

      return msg.edit("Automod has been enabled");
    } else if (data) {
      await automodData.findOneAndRemove({
        GuildID: interaction.guild.id,
      });

      return msg.edit("Automod has been disabled!");
    }
  }
};
