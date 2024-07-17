const express = require('express');
const RestroomSuggestion = require('../models/restroomSuggestion');
const Restroom = require('../models/restroom');
const User = require('../models/user');
const router = express.Router();

const SUGGESTION_THRESHOLD = 5; // Example threshold

// Suggest a new restroom
router.post('/', async (req, res) => {
    const { name, latitude, longitude, images, userId } = req.body;

    try {
        let suggestion = await RestroomSuggestion.findOne({ name, latitude, longitude });

        if (suggestion) {
            if (!suggestion.suggestedBy.includes(userId)) {
                suggestion.suggestionCount += 1;
                suggestion.suggestedBy.push(userId);

                if (suggestion.suggestionCount >= SUGGESTION_THRESHOLD) {
                    const newRestroom = new Restroom({
                        id: new Date().getTime(), // Replace with a better ID generation logic if needed
                        name: suggestion.name,
                        latitude: suggestion.latitude,
                        longitude: suggestion.longitude,
                        images: suggestion.images
                    });
                    await newRestroom.save();
                    await RestroomSuggestion.deleteOne({ _id: suggestion._id });

                    // Notify users who suggested
                    const users = await User.find({ _id: { $in: suggestion.suggestedBy } });
                    users.forEach(user => {
                        // Send notification (email, in-app, etc.)
                    });

                    return res.json({ message: 'Restroom added to the database' });
                } else {
                    await suggestion.save();
                }
            }
        } else {
            const newSuggestion = new RestroomSuggestion({
                name,
                latitude,
                longitude,
                images,
                suggestedBy: [userId]
            });
            await newSuggestion.save();
        }

        res.json({ message: 'Restroom suggestion submitted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
