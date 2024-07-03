const express = require('express');
const Restroom = require('../models/restroom');
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
    folder: 'restroom_images',
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Received request to add restroom:', req.body);
    console.log('File information:', req.file);

    const lastRestroom = await Restroom.findOne().sort({ id: -1 });
    const newId = lastRestroom ? lastRestroom.id + 1 : 1;
    const newRestroom = new Restroom({ 
      ...req.body, 
      id: newId,
      images: req.file ? [req.file.path] : [] // Add the image URL to the restroom
    });

    await newRestroom.save();
    res.json(newRestroom);
  } catch (err) {
    console.error('Error adding restroom:', err); // Log the error
    res.status(500).json({ error: err.message });
  }
});

router.get('/', (req, res) => {
  Restroom.find()
    .then(restrooms => res.json(restrooms))
    .catch(err => res.status(400).json({ error: err.message }));
});

router.post('/:id/reviews', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { user, rating, comment } = req.body;
  try {
    console.log('Received rating:', rating);
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating)) {
      return res.status(400).json({ success: false, message: 'Invalid rating value' });
    }

    // Add review to restroom
    const restroom = await Restroom.findOne({ id: parseInt(id) });
    if (!restroom) {
      return res.status(404).json({ success: false, message: 'Restroom not found' });
    }

    const review = {
      user,
      rating: parsedRating,
      comment,
      image: req.file ? req.file.path : null,
    };

    restroom.reviews.push(review);
    if (req.file) {
      restroom.images.push(req.file.path); // Add the image URL to the restroom's images array
    }
    restroom.calculateAverageRating();
    await restroom.save();

    res.json({ success: true, review });
  } catch (err) {
    console.error('Error adding review:', err); // Log the error
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/:id/images', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  try {
    const restroom = await Restroom.findOne({ id: parseInt(id) });
    if (!restroom) {
      return res.status(404).json({ success: false, message: 'Restroom not found' });
    }

    if (req.file) {
      restroom.images.push(req.file.path);
    }
    await restroom.save();

    res.json(restroom);
  } catch (err) {
    console.error('Error uploading image:', err); // Log the error
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
