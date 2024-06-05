const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    email: String,
    phone: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
