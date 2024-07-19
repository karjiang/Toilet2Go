const express = require('express');
const RestroomSuggestion = require('../models/restroomSuggestion');
const Restroom = require('../models/restroom');
const User = require('../models/user');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Load environment variables
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'restroom_suggestions',
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

const SUGGESTION_THRESHOLD = 5; // Example threshold

// Suggest a new restroom
router.post('/', upload.single('image'), async (req, res) => {
  const { name, latitude, longitude, userId } = req.body;
  const imageUrl = req.file ? req.file.path : null;

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

          return res.json({ message: 'Restroom added to the database' });
        } else {
          if (imageUrl) suggestion.images.push(imageUrl);
          await suggestion.save();
        }
      }
    } else {
      const newSuggestion = new RestroomSuggestion({
        name,
        latitude,
        longitude,
        images: imageUrl ? [imageUrl] : [],
        suggestedBy: [userId]
      });

      // Directly add to restrooms if threshold is 0
      if (SUGGESTION_THRESHOLD === 0) {
        const newRestroom = new Restroom({
          id: new Date().getTime(), // Replace with a better ID generation logic if needed
          name: newSuggestion.name,
          latitude: newSuggestion.latitude,
          longitude: newSuggestion.longitude,
          images: newSuggestion.images
        });
        await newRestroom.save();
        return res.json({ message: 'Restroom added to the database' });
      }

      await newSuggestion.save();
    }

    res.json({ message: 'Restroom suggestion submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
