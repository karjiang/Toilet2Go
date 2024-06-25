const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    restroomId: Number,
    rating: Number,
    comment: String
});

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    reviews: [reviewSchema],
    favoriteRestrooms: [Number], // List of restroom IDs
});

const User = mongoose.model('User', userSchema);

module.exports = User;
