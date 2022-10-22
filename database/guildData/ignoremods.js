const mongoose = require('mongoose')

const ignoremodsSchema = new mongoose.Schema({
    GuildID: String,
});

const ignoremods = module.exports = new mongoose.model('ignoremods', ignoremodsSchema)
