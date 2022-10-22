const Discord = module.require("discord.js");

module.exports = {
  name: "unlock",
  description: "Unlocks a Channel",
  userPerms: ["MANAGE_CHANNELS"],
  botPerms: ["EMBED_LINKS", "MANAGE_CHANNELS"],
  options: [
    {
      name: "image",
      description: "Attachment for a Image",
      type: "ATTACHMENT",
      required: "false",
    },
    {
      name: "channel",
      description: "Channel to unlock remotly",
      type: "CHANNEL",
      required: "false",
    },
    {
      name: "text",
      description: "A reason for the unlock(will be displayed)",
      type: "STRING",
      required: "false",
    },
  ],
  run: async (client, interaction, args) => {
    let text = interaction.options.getString("text");
    let channel = interaction.options.getChannel("channel");
    if (!channel) {
      channel = interaction.channel;
    }
    const image = interaction.options.getAttachment("image");
    if (!text) {
      text = `🔒 ${channel} has been unlocked`;
    }
    const embed = new Discord.MessageEmbed()
      .setTitle("Unlocked Channel")
      .setColor("GREEN")
      .setDescription(text);
    if (image) embed.setImage(image.url);
    const response = channel.permissionOverwrites.edit(interaction.guild.id, {
      SEND_MESSAGES: null,
    });
    if (!response)
      interaction.reply({
        content: "There was some issue unlocking this channel.",
        ephemeral: true,
      });
    const channelSend = interaction.options.getChannel("channel");
    if (!channelSend) {
      await interaction.reply({ embeds: [embed] });
    } else
      (await channel.send({ embeds: [embed] })) &&
        interaction.reply({ content: `Unlocked ${channel}` });
  },
};
