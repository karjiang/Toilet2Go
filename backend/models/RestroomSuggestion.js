const mongoose = require('mongoose');

const restroomSuggestionSchema = new mongoose.Schema({
    name: String,
    latitude: String,
    longitude: String,
    images: [String], // Array for image URLs
    suggestionCount: {
        type: Number,
        default: 1
    },
    suggestedBy: [String], // Store user IDs who suggested this restroom
    approved: {
        type: Boolean,
        default: false
    }
});

const RestroomSuggestion = mongoose.model('RestroomSuggestion', restroomSuggestionSchema);

module.exports = RestroomSuggestion;
