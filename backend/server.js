const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoURI = 'mongodb+srv://karljiang:Karljiang12@cluster0.yehicjl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB connection string


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    email: String,
    phone: String
});

const restroomSchema = new mongoose.Schema({
    name: String,
    latitude: String,
    longitude: String,
    rating: String
});

const User = mongoose.model('User', userSchema);
const Restroom = mongoose.model('Restroom', restroomSchema);

app.post('/users', (req, res) => {
    const newUser = new User(req.body);
    newUser.save()
        .then(user => res.json(user))
        .catch(err => res.status(400).json({ error: err.message }));
});

app.get('/users', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json({ error: err.message }));
});

app.post('/restrooms', (req, res) => {
    const newRestroom = new Restroom(req.body);
    newRestroom.save()
        .then(restroom => res.json(restroom))
        .catch(err => res.status(400).json({ error: err.message }));
});

app.get('/restrooms', (req, res) => {
    Restroom.find()
        .then(restrooms => res.json(restrooms))
        .catch(err => res.status(400).json({ error: err.message }));
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
