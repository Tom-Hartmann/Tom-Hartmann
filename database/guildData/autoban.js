const mongoose = require("mongoose");

const autoSchema = new mongoose.Schema({
  GuildID: String,
  Global: Boolean,
  UserID: String,
  Reason: String,
  AddedBy: String
});

const SuggestModel = (module.exports = mongoose.model("Autoban", autoSchema));
