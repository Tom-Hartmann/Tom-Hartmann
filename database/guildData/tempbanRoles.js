const mongoose = require("mongoose");

const banSchema = new mongoose.Schema({
  GuildID: { type: String, required: true },
  User: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  Roles: { type: String, required: true },
});

const Ban = mongoose.model("Ban", banSchema);

module.exports = Ban;
