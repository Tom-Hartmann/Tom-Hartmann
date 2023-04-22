const { InteractionType } = require("discord.js");

module.exports = async (interaction, client) => {
  const { OWNER_ID } = require("../../config.json");

  if (interaction.type !== InteractionType.ApplicationCommand) return;

  const command = client.slash.get(interaction.commandName);
  if (!command) return interaction.reply({ content: "an Erorr" });

  const isOwner = interaction.member.user.id === OWNER_ID;

  if (!isOwner) {
    if (command.ownerOnly) {
      return interaction.reply(
        "Command under development or only available for the developer!"
      );
    }

    if (command.userPerms) {
      const member = client.guilds.cache
        .get(interaction.guild.id)
        .members.cache.get(interaction.member.id);
      console.log(`member: ${member.user.tag}`);

      if (!member.permissions.has(command.userPerms || [])) {
        console.log(`missing permissions: ${command.userPerms}`);
        if (command.noUserPermsMessage) {
          return interaction.reply(command.noUserPermsMessage);
        } else {
          return interaction.reply(
            `You need the \`${command.userPerms}\` permission to use this command!`
          );
        }
      }
    }

    if (command.botPerms) {
      if (
        !client.guilds.cache
          .get(interaction.guild.id)
          .members.cache.get(client.user.id)
          .permissions.has(command.botPerms || [])
      ) {
        console.log(`missing bot permissions: ${command.botPerms}`);
        if (command.noBotPermsMessage) {
          return interaction.reply(command.noBotPermsMessage);
        } else {
          return interaction.reply(
            `I need the \`${command.botPerms}\` permission to execute this command!`
          );
        }
      }
    }
  }

  const args = [];

  for (let option of interaction.options.data) {
    if (option.type === "SUB_COMMAND") {
      if (option.name) args.push(option.name);
      option.options?.forEach((x) => {
        if (x.value) args.push(x.value);
      });
    } else if (option.value) args.push(option.value);
  }

  try {
    command.run(client, interaction, args);
  } catch (e) {
    console.error(`command.run error: ${e}`);
    interaction.reply({ content: e.message });
  }
};
