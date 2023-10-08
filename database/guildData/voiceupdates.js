const mongoose = require("mongoose");
const voiceSchema = new mongoose.Schema({
  GuildID: String,
  TemplateChannelID: String,
  CategoryID: String, 
});
const voiceModel = (module.exports = mongoose.model(
  "voiceupdates",
  voiceSchema
));
