const Discord = module.require("discord.js");

module.exports = {
  name: "unlock",
  description: "Unlocks a Channel",
  userPerms: ["MANAGE_CHANNELS"],
  botPerms: ["EMBED_LINKS", "MANAGE_CHANNELS", "MANAGE_MESSAGES"],
  run: async (client, message, args) => {
    message.channel.permissionOverwrites.edit(
      message.channel.guild.roles.everyone.id,
      {
        SEND_MESSAGES: null,
      }
    );
    const embed = new Discord.MessageEmbed()
      .setTitle("Channel Updates")
      .setDescription(`🔓 ${message.channel} has been Unlocked`)
      .setColor("RANDOM");
    await message.channel.send({ embeds: [embed] });
    message.delete();
  },
};
