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

module.exports = router;
