const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    hash: {
        type: String,
        required: true,
    },
    displayname: {
        type: String,
        required: true,
        validator: v => v.length() > 1 && v.length() < 50,
        message: props => `${props.value} is not a name between 1 and 50 characters`
    },
    bio: {
        type: String,
        validator: v => v.length() > 1 && v.length() < 300,
        message: props => `${props.value} is not a name between 1 and 300 characters`
    },
    gender: {
        type: String,
    },
    profilePictureURL: {
        type: String,
    },
    bannerColor: {
        type: String,
    },
    refreshToken: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(), 
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(), 
    },
}, { collection: 'user-data'} );

const User = mongoose.model('User', userSchema);

module.exports = User;