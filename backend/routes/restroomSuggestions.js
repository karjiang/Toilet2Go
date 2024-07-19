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

const SUGGESTION_THRESHOLD = 0; // Example threshold
const MAX_DISTANCE_MILES = 0.3; // Maximum distance in miles

// Function to calculate distance between two points using Haversine formula
function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of the earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLon / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in miles
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Function to calculate the midpoint
function calculateMidpoint(coordinates) {
  let x = 0, y = 0, z = 0;

  coordinates.forEach(([lat, lon]) => {
    lat = deg2rad(lat);
    lon = deg2rad(lon);
    x += Math.cos(lat) * Math.cos(lon);
    y += Math.cos(lat) * Math.sin(lon);
    z += Math.sin(lat);
  });

  const total = coordinates.length;
  x /= total;
  y /= total;
  z /= total;

  const lon = Math.atan2(y, x);
  const hyp = Math.sqrt(x * x + y * y);
  const lat = Math.atan2(z, hyp);

  return [lat * (180 / Math.PI), lon * (180 / Math.PI)];
}

// Suggest a new restroom
router.post('/', upload.single('image'), async (req, res) => {
  const { name, latitude, longitude, userId } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  try {
    let suggestion = await RestroomSuggestion.findOne({ name });

    if (suggestion) {
      const distance = getDistanceFromLatLonInMiles(latitude, longitude, suggestion.latitude, suggestion.longitude);
      if (distance <= MAX_DISTANCE_MILES) {
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

        const suggestions = await RestroomSuggestion.find({ name });
        const coordinates = suggestions.map(s => [s.latitude, s.longitude]);
        coordinates.push([latitude, longitude]);
        const midpoint = calculateMidpoint(coordinates);

        suggestion.latitude = midpoint[0];
        suggestion.longitude = midpoint[1];
        await suggestion.save();
      } else {
        const newSuggestion = new RestroomSuggestion({
          name,
          latitude,
          longitude,
          images: imageUrl ? [imageUrl] : [],
          suggestedBy: [userId]
        });
        await newSuggestion.save();
      }
    } else {
      const newSuggestion = new RestroomSuggestion({
        name,
        latitude,
        longitude,
        images: imageUrl ? [imageUrl] : [],
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
