const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  User: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  Roles: {
    type: mongoose.SchemaTypes.String
  },
});

module.exports = mongoose.model('TempBan', Schema);
