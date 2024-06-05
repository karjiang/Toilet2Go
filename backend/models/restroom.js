const mongoose = require('mongoose');

const restroomSchema = new mongoose.Schema({
    name: String,
    latitude: String,
    longitude: String,
    rating: String
});

const Restroom = mongoose.model('Restroom', restroomSchema);

module.exports = Restroom;
