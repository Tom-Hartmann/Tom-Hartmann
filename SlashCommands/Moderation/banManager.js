const ms = require("ms");
const humanizeDuration = require("humanize-duration");
const tempSchema = require("../../database/guildData/tempban");
const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "banmenu",
  description: "Ban users.",
  botPerms: ["BAN_MEMBERS"],
  userPerms: ["BAN_MEMBERS"],
  options: [
    {
      name: "ban",
      description: "Ban a user from the guild",
      type: "SUB_COMMAND",
      options: [
        {
          name: "member",
          description: "Member to ban",
          type: "USER",
          required: "true",
        },
        {
          name: "reason",
          description: "A reason for the ban",
          type: "STRING",
          required: "false",
        },
      ],
    },
    {
      name: "tempban",
      description: "Ban a user from the guild",
      type: "SUB_COMMAND",
      options: [
        {
          name: "member",
          description: "Member to tempban",
          type: "USER",
          required: "true",
        },
        {
          name: "time",
          description:
            "How many days should the user be banned? More than 30 is not allowed.",
          type: "NUMBER",
          required: "true",
        },
        {
          name: "reason",
          description: "A reason for the ban",
          type: "STRING",
          required: "false",
        },
      ],
    },
  ],
  run: async (interaction) => {
    if (interaction.options.getSubcommand() === "ban") {
      const member = interaction.options.getUser("member");
      let reason = interaction.options.getString("reason");

      if (!reason) {
        reason = `Banned by ${interaction.user.username}`;
      }
      console.log(reason);
      const response = await member.ban({
        deleteMessageDays: 7,
        reason: reason,
      });
      if (!response)
        return interaction.followUp({
          content:
            "I am sorry but for some reason I am unable to ban this member.",
          ephemeral: true,
        });
      return interaction.followUp({ content: `${member} has been banned.` });
    } else if (interaction.options.getSubcommand() === "tempban") {
      const member = interaction.options.getUser("member");
      let time = interaction.options.getNumber("time");
      if (time > 30) {
        return interaction.reply({
          contents: "You cannot tempban over 30 Days, just ban the person.",
          ephemeral: true,
        });
      } else time = time + "D";
      console.log(time);
      let reason = interaction.options.getString("reason");
      if (!reason) {
        reason = `Tempbanned by ${interaction.user.username}`;
      }
      console.log(reason);
      if (!member.bannable) {
        return interaction.reply({
          contents: `${member} is not bannable. Make sure my role is above the persons role.`,
          ephemeral: true,
        });
      }
      const testmsg = member.send(`Hello!`);
      if (testmsg) {
        if (member.bannable) {
          const roles = member._roles.join(", ");
          const tempbanRoles = new tempSchema({
            User: member.id,
            Roles: roles,
          });
          tempbanRoles.save();
          var Inv = await interaction.channel.createInvite({
            maxUses: 1,
            unique: true,
            reason: `Temp-banned for ${humanizeDuration(ms(time))} by ${
              interaction.user.username
            }`,
            maxAge: 0,
          });
          const invitelink = new MessageEmbed()
            .setColor("#146CFF")
            .setTitle("Invite")
            .setDescription(
              `You have been banned for ${humanizeDuration(
                ms(time)
              )}, you can rejoin after that and you're roles will be back.\n${
                Inv.url
              } heres your invite for joining back.`
                .setFooter("Ban ends at: ~")
                .setTimestamp(Date.now() + ms(time))
            );
          await member.send(invitelink);
        }
        const banthemember = await member.ban({
          deleteMessageDays: 0,
          reason: reason,
        });
        if (banthemember) {
          interaction.followUp({
            contents: `${member} has now been temp-banned for ${humanizeDuration(
              ms(time)
            )}`,
          });
          setTimeout(function () {
            try {
              interaction.guild.fetchBans().then((bans) => {
                interaction.guild.members.unban(member);
              });
            } catch (error) {
              interaction.reply({
                contens: `${error} I ran into some error unbanning ${member}, maybe he is already unbanned?`,
                ephemeral: true,
              });
            }
            interaction.reply({ contens: `${member} has been unbanned` });
          });
        } else {
          interaction.followUp({
            contents: `I couldn't ban the member or ran into some issue.`,
          });
        }
      }
    }
  },
};
