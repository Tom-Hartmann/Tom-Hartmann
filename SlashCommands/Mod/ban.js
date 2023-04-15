const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const humanizeDuration = require("humanize-duration");
const { OWNER_ID } = require("../../config.json");
const autobanData = require("../../database/guildData/autoban");
const tempbanData = require("../../database/guildData/tempbanRoles");

module.exports = {
  name: "ban",
  description: "Ban members from your server!",
  subCommands: ["member", "soft", "hack", "remove", "autoban", "tempban"],
  category: "Moderation",
  userPerms: ["BanMembers"],
  botPerms: ["BanMembers", "EmbedLinks"],
  options: [
    {
      name: "member",
      description: "The member you want to ban!",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "member",
          description: "The member you want to ban!",
          required: true,
          type: ApplicationCommandOptionType.Mentionable,
        },
        {
          name: "reason",
          description: "The reason for the ban!",
          required: false,
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
    {
      name: "soft",
      description:
        "Soft ban a member in you server!(1Day ban, does not return roles upon joining back!)",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "member",
          description: "The member you want to soft ban!",
          required: true,
          type: ApplicationCommandOptionType.Mentionable,
        },
        {
          name: "reason",
          description: "The reason for the soft ban!",
          required: false,
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
    {
      name: "hack",
      description: "Bans a member who is not in your server!",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The ID of the member you want to ban!",
          required: true,
          type: ApplicationCommandOptionType.Integer,
        },
        {
          name: "reason",
          description: "The reason for the ban!",
          required: false,
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
    {
      name: "remove",
      description: "Removes a ban from a member!",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The ID of the member you want to remove a ban from!",
          required: true,
          type: ApplicationCommandOptionType.Integer,
        },
        {
          name: "reason",
          description: "The reason for the ban!",
          required: false,
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
    {
      name: "autoban",
      description:
        "Adds a user that is currently not in your guild and once rejoining will be automatically banned!",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The ID of the user you want to autoban from the guild.",
          required: true,
          type: ApplicationCommandOptionType.Integer,
        },
        {
          name: "reason",
          description: "The reason for the ban!",
          required: false,
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
    {
      name: "tempban",
      description:
        "Tempban a member in the guild for a custom duration, he will get all roles back once he is back.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "member",
          description: "The member you want to tempban!",
          required: true,
          type: ApplicationCommandOptionType.Mentionable,
        },
        {
          name: "duration",
          description: "Duration in hours (max:720)",
          required: true,
          type: ApplicationCommandOptionType.Integer,
        },
        {
          name: "reason",
          description: "The reason for the tempban",
          required: false,
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
  ],
  run: async (client, interaction, args) => {
    if (interaction.options.getSubcommand() === "member") {
      let reason = await interaction.options.getString("reason");
      if (!reason) reason = "Unspecified";
      const target = await interaction.options.getMentionable("member");

      if (target.id === interaction.member.id) {
        return interaction.reply(
          `**${interaction.member.user.username}**, You can not ban yourself!`
        );
      }
      if (target.id === interaction.guild.ownerId) {
        return interaction.reply("You cannot Ban The Server Owner");
      }

      if (
        target.roles.highest.position >=
        interaction.member.roles.highest.position
      ) {
        return interaction.reply(
          "You cannot Ban Someone who has higher or same role as you!"
        );
      }
      if (
        target.roles.highest.position >=
        interaction.guild.me.roles.highest.position
      ) {
        return interaction.reply(
          "I cannot Ban Someone who has higher or same role as me!"
        );
      }

      let banEmbed = new EmbedBuilder()
        .setTitle("Action : Ban")
        .setDescription(`Banned ${target} (${target.id})\nReason: ${reason}`)
        .setColor("#ff2050")
        .setThumbnail(target.avatarURL)
        .setFooter(`Banned by ${interaction.member.user.tag}`);

      target.ban({
        reason: reason ? "Infinity Ban Command" : reason,
      });

      return interaction.reply({ embeds: [banEmbed] });
    } else if (interaction.options.getSubcommand() === "soft") {
      let reason = await interaction.options.getString("reason");
      if (!reason) reason = "Unspecified";
      const target = await interaction.options.getMentionable("member");

      if (target.id === interaction.member.id) {
        return interaction.reply(
          `**${interaction.member.user.username}**, You can not ban yourself!`
        );
      }
      if (target.id === interaction.guild.ownerId) {
        return interaction.reply("You cannot Ban The Server Owner");
      }

      if (
        target.roles.highest.position >=
        interaction.member.roles.highest.position
      ) {
        return interaction.reply(
          "You cannot Ban Someone who has higher or same role as you!"
        );
      }
      if (
        target.roles.highest.position >=
        interaction.guild.me.roles.highest.position
      ) {
        return interaction.reply(
          "I cannot Ban Someone who has higher or same role as me!"
        );
      }

      let softBanEmbed = new EmbedBuilder()
        .setTitle("Action : Ban")
        .setDescription(`Banned ${target} (${target.id})\nReason: ${reason}`)
        .setColor("#ff2050")
        .setThumbnail(target.avatarURL)
        .setFooter(`Banned by ${message.author.tag}`);

      target.ban({
        days: 1,
        reason: reason ? "Infinity Ban Command" : reason,
      });

      message.channel.send({ embeds: [softBanEmbed] });
    } else if (interaction.options.getSubcommand() === "hack") {
      let reason = await interaction.options.getString("reason");
      if (!reason) reason = "Unspecified";
      const target = await interaction.options.getInteger("id");

      let targetUser = await client.users.fetch(target);

      if (!targetUser) {
        return interaction.reply("Couldn't find the user!");
      }

      if (target === interaction.member.id) {
        return interaction.reply(
          `**${interaction.member.user.username}**, You can not ban yourself!`
        );
      }
      if (target === interaction.guild.ownerId) {
        return interaction("You cannot Ban The Server Owner");
      }
      let targetMember = await targetUser.member;
      let hackBanEmbed = new EmbedBuilder()
        .setTitle("Action : Ban")
        .setDescription(`Banned ${targetUser} (${target})\nReason: ${reason}`)
        .setColor("#ff2050")
        .setThumbnail(targetUser.avatarURL)
        .setFooter(`Banned by ${interaction.member.user.tag}`);

      await interaction.guild.members.ban(target, {
        reason: reason ? "Infinity Ban Command" : reason,
      });

      return interaction.reply({ embeds: [hackBanEmbed] });
    } else if (interaction.options.getSubcommand() === "remove") {
      let reason = await interaction.options.getString("reason");
      if (!reason) reason = "Unspecified";
      const target = await interaction.options.getString("id");

      let targetUser = await client.users.fetch(target);

      if (!targetUser) {
        return interaction.reply("Couldn't find the user!");
      }

      if (target === interaction.member.id) {
        return interaction.reply(
          `**${interaction.member.user.username}**, You can not unban yourself!`
        );
      }
      if (target === interaction.guild.ownerId) {
        return interaction("You cannot unan The Server Owner");
      }
      let targetMember = await targetUser.member;
      let unBanEmbed = new EmbedBuilder()
        .setTitle("Action : Unban")
        .setDescription(`Unbanned ${targetUser} (${target})\nReason: ${reason}`)
        .setColor("GREEN")
        .setThumbnail(targetUser.avatarURL)
        .setFooter(`Unbanned by ${interaction.member.user.tag}`);

      await interaction.guild.members.unban(target, {
        reason: reason ? "Infinity Ban Command" : reason,
      });

      return interaction.reply({ embeds: [unBanEmbed] });
    } else if (interaction.options.getSubcommand() === "autoban") {
      let reason = await interaction.options.getString("reason");
      const target = await interaction.options.getInteger("id");
      if (!reason) reason = "Unspecified";
      let autobanEmbed = new EmbedBuilder()
        .setTitle("Action : Autoban")
        .setDescription(`Autoban ID:(${target})\nReason:${reason}`)
        .setColor("Green")
        .setFooter(
          `Autobanned by ${interaction.member.username}(${interaction.member.id})`
        );
      let global = false;
      try {
        const user = await client.users.fetch(target);

        if (user) {
          interaction.reply(
            `${user} exists on the guild. Please ban him directly instead!`
          );
        }
      } catch (error) {}
      if (interaction.guild.ownerId === interaction.member.id) {
        global = true;
      }
      if (interaction.member.id === OWNER_ID) {
        global = true;
      }
      let Reason = `Reason provided: ${reason}`;
      if (
        target === interaction.member.id ||
        OWNER_ID ||
        interaction.guild.ownerId
      )
        return interaction.reply(
          "Sorry but I cannot allow you to add either urself, my owner or the guild owner."
        );

      let newData = new autobanData({
        GuildID: interaction.guild.id,
        Global: global,
        UserID: target,
        Reason: Reason,
        AddedBy: `${interaction.member.username}(${interaction.member.id})`,
      });
      await newData.save();
      return interaction.reply({ embeds: [autobanEmbed] });
    } else if (interaction.options.getSubcommand() === "tempban") {
      const member = interaction.options.getMentionable("member");
      let duration = interaction.options.getInteger("duration");
      let reason = interaction.options.getString("reason");
      if (duration > 720) {
        return interaction.reply({
          contents: "You cannot tempban over 30days!",
          ephemeral: true,
        });
      } else duration = duration + "H";
      if (!member.bannable) {
        return interaction.reply({
          contents: `${member} is not bannable. Make sure my role is above the persons role.`,
          ephemeral: true,
        });
      }
      const expiresAt = new Date(Date.now() + duration);
      const roles = member._roles.join(", ");
      const tempbanRoles = new tempSchema({
        User: member.id,
        Roles: roles,
        expiresAt: expiresAt,
      });
      tempbanRoles.save();
      var Inv = await interaction.channel.createInvite({
        maxUses: 1,
        unique: true,
        reason: `Temp-banned for ${humanizeDuration(ms(duration))} by ${
          interaction.user.username
        }`,
        maxAge: 0,
      });
      const invitelinkEmbed = new EmbedBuilder()
        .setColor("#146CFF")
        .setTitle("Invite")
        .setDescription(
          `You have been banned for ${humanizeDuration(
            ms(duration)
          )}, you can rejoin after that and you're roles will be back.\n${
            Inv.url
          } heres your invite for joining back.`
            .setFooter("Ban ends at: ~")
            .setTimestamp(Date.now() + ms(duration))
        );
      const testmsg = member.send("Hello!").catch(err);
      if (testmsg) {
        await member.send(invitelinkEmbed);
      }
      const banthemember = await member.ban({
        deleteMessageDays: 0,
        reason: reason,
      });
      if (banthemember) {
        interaction.followUp({
          contents: `${member} has now been temp-banned for ${humanizeDuration(
            ms(duration)
          )}`,
        });
      }
    }
  },
};
