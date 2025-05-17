const mongoose = require('mongoose');
const { profilePictures} = require('../constants/index')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    profilePicture: {
        type: String,
        required: true,
        default: profilePictures[Math.floor(Math.random() * profilePictures.length)]
    }
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);