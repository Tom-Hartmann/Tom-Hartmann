const { ChannelType, PermissionsBitField } = require("discord.js");
const voiceData = require("../../database/guildData/voiceupdates");

module.exports = async (oldState, newState) => {
  // Retrieve data from the database.
  let data;
  try {
    data = await voiceData.findOne({ GuildID: newState.guild.id });
  } catch (error) {
    console.error("Error fetching voice data:", error);
    return;
  }

  if (!data || !data.TemplateChannelID) return;

  // Check if there's an existing category.
  let category = newState.guild.channels.cache.find(
    (c) =>
      c.name == "✨Private Channels✨" && c.type == ChannelType.GuildCategory
  );

  // Create the category if it doesn't exist.
  if (!category && newState.channelId === data.TemplateChannelID) {
    category = await newState.guild.channels.create({
      name: "✨Private Channels✨",
      type: ChannelType.GuildCategory,
      position: newState.guild.channels.cache.size,
    });
  }

  // If the member joins the template channel.
  if (newState.channelId === data.TemplateChannelID) {
    try {
      const newVoiceChannel = await newState.guild.channels.create({
        name: `✨${newState.member.displayName}`,
        type: ChannelType.GuildVoice,
        parent: category.id,
        permissionOverwrites: [
          {
            id: newState.guild.roles.everyone,
            deny: [
              PermissionsBitField.Flags.MuteMembers,
              PermissionsBitField.Flags.MoveMembers,
              PermissionsBitField.Flags.ManageChannels,
              PermissionsBitField.Flags.ManageRoles,
            ],
          },
          {
            id: newState.member.id,
            allow: [
              PermissionsBitField.Flags.MuteMembers,
              PermissionsBitField.Flags.MoveMembers,
              PermissionsBitField.Flags.ManageChannels,
              PermissionsBitField.Flags.ManageRoles,
            ],
          },
          {
            id: newState.client.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.Connect,
              PermissionsBitField.Flags.Speak,
              PermissionsBitField.Flags.MuteMembers,
              PermissionsBitField.Flags.DeafenMembers,
              PermissionsBitField.Flags.MoveMembers,
              PermissionsBitField.Flags.UseVAD,
              PermissionsBitField.Flags.ManageChannels,
              PermissionsBitField.Flags.ManageRoles,
            ],
          },
        ],
      });

      await newState.setChannel(newVoiceChannel);
    } catch (error) {
      console.error("Error creating private voice channel:", error);
    }
  }

  // Cleanup function to delete empty channels and potentially the category.
  const cleanup = async () => {
    const category = oldState.guild.channels.cache.find(
      (c) =>
        c.name === "✨Private Channels✨" &&
        c.type === ChannelType.GuildCategory
    );

    if (!category) return;

    const children = oldState.guild.channels.cache.filter(
      (channel) => channel.parentId === category.id
    );

    children.each((channel) => {
      if (
        channel.type === ChannelType.GuildVoice &&
        channel.members.size === 0
      ) {
        channel.delete("Private voice channel empty");
      }
    });

    // Checking after a short delay to ensure all deletions have been processed.
    setTimeout(() => {
      if (
        oldState.guild.channels.cache.filter((c) => c.parentId === category.id)
          .size === 0
      ) {
        category.delete("Empty private channels category");
      }
    }, 1000);
  };
  // Cleanup when a user leaves a voice channel.
  if (!newState.channelId || oldState.channelId !== newState.channelId) {
    await cleanup();
  }
};
