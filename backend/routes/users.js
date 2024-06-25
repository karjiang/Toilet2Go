const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Add a new user
router.post('/', async (req, res) => {
    try {
        const lastUser = await User.findOne().sort({ id: -1 });
        const newId = lastUser ? lastUser.id + 1 : 1;
        const newUser = new User({ ...req.body, id: newId });
        await newUser.save();
        res.json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all users
router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json({ error: err.message }));
});

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email } = req.body;
    try {
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.json({ success: false, message: 'User already exists' });
        }
        const lastUser = await User.findOne().sort({ id: -1 });
        const newId = lastUser ? lastUser.id + 1 : 1;
        const newUser = new User({ ...req.body, id: newId });
        await newUser.save();
        res.status(201).json({ success: true, user: newUser });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// User login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username, password })
        .then(user => {
            if (user) {
                res.json({ success: true, user });
            } else {
                res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Add a review to a user
router.post('/:id/reviews', async (req, res) => {
    const { id } = req.params;
    const { restroomId, rating, comment } = req.body;
    try {
        const user = await User.findOne({ id: parseInt(id) });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.reviews.push({ restroomId, rating, comment });
        await user.save();
        res.json({ success: true, review: { restroomId, rating, comment } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Add a favorite restroom to a user
router.post('/:id/favorites', async (req, res) => {
    const { id } = req.params;
    const { restroomId } = req.body;
    try {
        const user = await User.findOne({ id: parseInt(id) });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (!user.favoriteRestrooms.includes(restroomId)) {
            user.favoriteRestrooms.push(restroomId);
            await user.save();
        }
        res.json({ success: true, favoriteRestrooms: user.favoriteRestrooms });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
