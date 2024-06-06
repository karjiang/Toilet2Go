const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.post('/', (req, res) => {
    const newUser = new User(req.body);
    newUser.save()
        .then(user => res.json(user))
        .catch(err => res.status(400).json({ error: err.message }));
});

router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json({ error: err.message }));
});

// New route for registration
router.post('/register', async (req, res) => {
    const { username, email } = req.body;
    try {
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.json({ success: false, message: 'User already exists' });
        }
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ success: true, user: newUser });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username, password })
        .then(user => {
            if (user) {
                res.json({ success: true, user });
            } else {
                res.json({ success: false, message: 'Invalid username or password' });
            }
        })
        .catch(err => res.json({ success: false, error: err.message }));
});

module.exports = router;
