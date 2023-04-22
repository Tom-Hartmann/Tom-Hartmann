const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "purge",
  description: "purge",
  botPerms: ["ManageMessages"],
  userPerms: ["ManageMessages"],
  options: [
    {
      name: "number",
      description: "The number of messages to delete (1-200)",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    },
  ],
  run: async (client, interaction, args) => {
    const msgnum = interaction.options.getInteger("number");
    if (msgnum < 1 || msgnum > 200) {
      return interaction.reply({
        content: "The number must be between 1 and 200.",
        ephemeral: true,
      });
    }
    interaction.reply({
      content:
        "Starting to delete messages...\nI will edit this message once im done!",
      ephemeral: true,
    });
    const twoWeeksAgo = new Date(Date.now() - 12096e5); // 14 days in milliseconds
    let bulkDeleteCount = 0;
    let deleteCount = 0;
    let messagesDeleted = 0;
    let messages;
    let remainingMessages;

    do {
      const batchsize = Math.min(msgnum - (bulkDeleteCount + deleteCount), 100);
      messages = await interaction.channel.messages.fetch({ limit: batchsize });

      if (messages.size === 0) {
        break;
      }

      remainingMessages = messages.filter(
        (msg) => msg.createdAt >= twoWeeksAgo
      );
      messagesDeleted = remainingMessages.size; // Update this line

      if (remainingMessages.size > 0) {
        const deletedMessages = await interaction.channel.bulkDelete(
          remainingMessages
        );
        bulkDeleteCount += deletedMessages.size;
      }
      for (const [id, message] of messages) {
        if (message.createdAt < twoWeeksAgo) {
          await message.delete();
          deleteCount++;
        }
      }
    } while (bulkDeleteCount + deleteCount < msgnum); // Update this line

    const replyMessage = `Done, If you wish you can delete this\n\n${bulkDeleteCount} messages were deleted using bulk delete\n${deleteCount} messages were deleted individually`;
    try {
      interaction.editReply({
        content: replyMessage,
      });
    } catch (error) {}
  },
};
