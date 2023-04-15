const clientEvent = (event) => require(`../events/client/${event}`);
const guildEvent = (event) => require(`../events/guild/${event}`);
const menuEvents = (event) => require(`../events/interactions/menus/${event}`);
const otherEvent = (event) => require(`../events/functions/${event}`);
const Discord = require("discord.js");

function loadEvents(client) {
  const cooldowns = new Discord.Collection();

  // client events
  client.on("ready", () => clientEvent("ready")(client));
  client.on("messageCreate", (m) => clientEvent("mention")(m, client));

  // guild events
  client.on("interactionCreate", (m) =>
    guildEvent("interactionCreate")(m, client)
  );
  client.on("messageCreate", (m) => guildEvent("command")(m, cooldowns));
  client.on("messageDelete", (m) => guildEvent("messageDelete")(m));
  client.on("messageUpdate", (m, n) => guildEvent("messageUpdate")(m, n));
  client.on("channelCreate", (m) => guildEvent("channelCreate")(m));
  client.on("channelDelete", (m) => guildEvent("channelDelete")(m));
  client.on("roleCreate", (m) => guildEvent("roleCreate")(m));
  client.on("roleDelete", (m) => guildEvent("roleDelete")(m));
  client.on("channelUpdate", (m, n) => guildEvent("channelUpdate")(m, n));
  client.on("roleUpdate", (m, n) => guildEvent("roleUpdate")(m, n));
  client.on("guildMemberUpdate", (m, n) =>
    guildEvent("guildMemberUpdate")(m, n)
  );
  client.on("guildMemberAdd", (m) => guildEvent("guildMemberAdd")(m));
  client.on("guildMemberRemove", (m) => {
    try {
      guildEvent("guildMemberRemove")(m);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("guildBanAdd", (m) => guildEvent("guildBanAdd")(m));
  client.on("guildBanRemove", (m) => guildEvent("guildBanRemove")(m));
  client.on("voiceStateUpdate", (m, n) => guildEvent("voiceStateUpdate")(m, n));
  client.on("guildUpdate", (m, n) => guildEvent("guildUpdate")(m, n));
  client.on("threadUpdate", (m, n) => guildEvent("threadUpdate")(m, n, client));
  client.on("threadMembersUpdate", (m, n) =>
    guildEvent("threadMembersUpdate")(m, n, client)
  );
  client.on("threadCreate", (m) => guildEvent("threadCreate")(m, client));
  client.on("threadDelete", (m) => guildEvent("threadDelete")(m, client));

  // other events
  client.on("messageCreate", (m) => otherEvent("antilinks")(m));
  client.on("messageCreate", (m) => otherEvent("antiwords")(m));
  client.on("guildMemberAdd", (m) => otherEvent("autorole")(m));
  client.on("guildMemberAdd", (m) => otherEvent("welcome")(m));
  client.on("guildMemberRemove", (m) => otherEvent("goodbye")(m));

  // Menu Events
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("help")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("antilink")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("autorole")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("automod")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("prefix")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("welcomeChannel")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("leaveChannel")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("welcomeMessage")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("leaveMessage")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("variables")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("channelUpdates")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("memberUpdates")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("messageUpdates")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("roleUpdates")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("serverUpdates")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("voiceStateUpdates")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  client.on("interactionCreate", (m) => {
    try {
      menuEvents("suggestions")(m, client);
    } catch (error) {
      console.error(error);
    }
  });
  // warnings and errors
  client.on("warn", (info) => console.log(info));
  client.on("error", (error) => {
    console.error(error);
    // send an error message to a specific channel or user
    const errorMessage = `An error has occurred: ${error}`;
    const errorChannel = client.channels.cache.get("CHANNEL_ID");
    errorChannel.send(errorMessage);
  });
}

module.exports = {
  loadEvents,
};
