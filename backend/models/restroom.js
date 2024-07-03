const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: String,
    rating: Number,
    comment: String
});

const restroomSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    name: String,
    latitude: String,
    longitude: String,
    rating: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],
    images: [String] // Add an array for image URLs
});


restroomSchema.methods.calculateAverageRating = function () {
    if (this.reviews.length === 0) {
        this.rating = 0;
    } else {
        const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.rating = total / this.reviews.length;
    }
};

const Restroom = mongoose.model('Restroom', restroomSchema);

module.exports = Restroom;
