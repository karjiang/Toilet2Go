const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoURI = 'mongodb+srv://karljiang:Karljiang12@cluster0.yehicjl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const userRoutes = require('./routes/users');
const restroomRoutes = require('./routes/restrooms');
const suggestRoutes = require('./routes/restroomSuggestions');

app.use('/users', userRoutes);
app.use('/restrooms', restroomRoutes);
app.use('/suggest', suggestRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
