const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    fileURL: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    userID: {
        type: String, 
        required: true,
    },

    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    }
}, {
    collection: "posts"
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;