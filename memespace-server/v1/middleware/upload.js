const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// upload for profile pictures
const profilePictureStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadDir = path.join(__dirname, "../uploads/profile");
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});
const profilePictureUpload = multer({
    storage: profilePictureStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 2
    }
});


// upload for posts
const postStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadDir = path.join(__dirname, "../uploads/posts");
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});
const postUpload = multer({
    storage: postStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 2
    }
});


// filter for only allowing image file types through
function imageFilter(req, file, callback) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        callback(null, true);
    } else {
        console.log('Only jpg/jpeg & png file types are supported!');
        callback(null, false);
    }
}

module.exports = { profilePictureUpload, postUpload };