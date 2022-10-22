const OWNER_ID = require("../../config.json").OWNER_ID;
const TOKEN = require("../../config.json").BOT_TOKEN;
module.exports = {
  name: "shutdown",
  description: "Shut's down the bot",
  run: async (client, message, args) => {
    if (message.author.id != OWNER_ID) {
      return message.channel.send("Limited to the bot owner only!");
    }
    message.channel.send("Shutting down...").then((m) => {
      client.destroy();
      client.login(TOKEN);
      message.channel.send("Im back!");
      console.log("Restarted sucessfully");
    });
  },
};
