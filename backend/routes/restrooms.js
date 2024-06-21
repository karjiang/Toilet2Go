const express = require('express');
const Restroom = require('../models/restroom');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const lastRestroom = await Restroom.findOne().sort({ id: -1 });
        const newId = lastRestroom ? lastRestroom.id + 1 : 1;
        const newRestroom = new Restroom({ ...req.body, id: newId });
        await newRestroom.save();
        res.json(newRestroom);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', (req, res) => {
    Restroom.find()
        .then(restrooms => res.json(restrooms))
        .catch(err => res.status(400).json({ error: err.message }));
});

router.post('/:id/reviews', async (req, res) => {
    const { id } = req.params;
    const { user, rating, comment } = req.body;
    try {
        const restroom = await Restroom.findOne({ id: parseInt(id) });
        if (!restroom) {
            return res.status(404).json({ success: false, message: 'Restroom not found' });
        }
        restroom.reviews.push({ user, rating, comment });
        restroom.calculateAverageRating();  // Calculate average rating
        await restroom.save();
        res.json({ success: true, review: { user, rating, comment } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
