const mongoose = require("mongoose");
const privateSchema = new mongoose.Schema({
  GuildID: Number,
  ChannelID: Number,
  CatergoryForChannelToJoin: Number,
  CatergoyForNewChannelToGetMoved: Number,
});
const voiceModel = (module.exports = mongoose.model(
  "privateChannel",
  privateSchema
));
