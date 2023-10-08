const voiceData = require("../../database/guildData/voiceupdates");
const { ERROR_LOGS_CHANNEL } = require("../../config.json");

module.exports = async (oldState, newState) => {
  let data;

  try {
    data = await voiceData.findOne({
      GuildID: newState.guild.id,
    });
  } catch (error) {
    console.error("Error fetching voice data:", error);
    return;
  }

  if (!data || !data.TemplateChannelID) return;

  // Fetch or create the category.
  let category = newState.guild.channels.cache.find(
    (c) => c.name == "✨Private Channels✨" && c.type == "GUILD_CATEGORY"
  );

  if (!category) {
    category = await newState.guild.channels.create("✨Private Channels✨", {
      type: "GUILD_CATEGORY",
      position: newState.guild.channels.cache.size, // Should create it at the bottom.
    });
  }

  // User joined the pre-defined channel to create a new private channel.
  if (newState.channelId && newState.channelId === data.TemplateChannelID) {
    try {
      const newVoiceChannel = await newState.guild.channels.create(
        `Private-${newState.member.displayName}`,
        {
          type: "GUILD_VOICE",
          parent: category.id,
          reason: "Private voice channel creation",
          permissionOverwrites: [
            {
              id: newState.guild.roles.everyone, // For everyone
              deny: [
                "MUTE_MEMBERS",
                "MOVE_MEMBERS",
                "MANAGE_CHANNELS",
                "MANAGE_ROLES",
              ],
            },
            {
              id: newState.member.id, // For the creator of the channel
              allow: [
                "MUTE_MEMBERS",
                "MOVE_MEMBERS",
                "MANAGE_CHANNELS",
                "MANAGE_ROLES",
              ],
            },
            {
              id: newState.client.user.id, // For the bot
              allow: [
                "VIEW_CHANNEL",
                "CONNECT",
                "SPEAK",
                "MUTE_MEMBERS",
                "DEAFEN_MEMBERS",
                "MOVE_MEMBERS",
                "USE_VAD",
                "MANAGE_CHANNELS",
                "MANAGE_ROLES",
              ],
            },
          ],
        }
      );

      await newState.setChannel(newVoiceChannel); // Move the member to the new private channel.
    } catch (error) {
      const logChannel = newState.guild.channels.cache.get(ERROR_LOGS_CHANNEL);
      if (logChannel && logChannel.isText()) {
        logChannel.send("Error creating private voice channel:", error);
      }
      console.error("Error creating private voice channel:", error);
    }
  }

  // Check if a user left a channel and if it's a private channel to delete when empty.
  if (oldState.channelId && !newState.channelId) {
    const voiceChannel = oldState.channel;
    if (
      voiceChannel.name.startsWith("Private-") &&
      voiceChannel.members.size === 0
    ) {
      voiceChannel.delete("Private voice channel empty").catch((error) => {
        const logChannel =
          newState.guild.channels.cache.get(ERROR_LOGS_CHANNEL);
        if (logChannel && logChannel.isText()) {
          logChannel.send("Error deleting private voice channel:", error);
        }
        console.error("Error deleting private voice channel:", error);
      });

      // If category is empty after deleting the voice channel, delete the category.
      if (category.children.size === 1) {
        category.delete("No channels in category").catch((error) => {
          console.error("Error deleting category:", error);
        });
      }
    }
  }
};
