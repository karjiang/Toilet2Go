const express = require('express');
const Restroom = require('../models/restroom');

const router = express.Router();

router.post('/', (req, res) => {
    const newRestroom = new Restroom(req.body);
    newRestroom.save()
        .then(restroom => res.json(restroom))
        .catch(err => res.status(400).json({ error: err.message }));
});

router.get('/', (req, res) => {
    Restroom.find()
        .then(restrooms => res.json(restrooms))
        .catch(err => res.status(400).json({ error: err.message }));
});

module.exports = router;
