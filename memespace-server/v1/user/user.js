const express = require('express');
const router = express.Router();
const { profilePictureUpload } = require('../middleware/upload.js');
const User = require('../models/user');
const statusCodes = require('../util/statusCodes');
const fs = require('fs');
const path = require('path');
const authenticateToken = require('../middleware/authenticateToken.js');

// get all users
router.get("/all", async (req, res) => {
    try {
        const users = await User.find({});
        const filteredUsers = users.map((user) => {
            const {hash, ...filteredUser} = user.toObject();
            return filteredUser;
        });
        return res.status(statusCodes.OK).json({users: filteredUsers});
    } catch (error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({error: error});
    }
});

// get the current authenticated user (CHANGE)
router.get('/', authenticateToken, async (req, res) => {
    try {   
        const email = req.user.email;
        console.log(email);
        if (!email) {
            return res.status(statusCodes.BAD_REQUEST).json({error: "Must provide an email in the params to obtain the user!"});
        }
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({error: "User not found with email: " + email + "!"});
        }
        delete user.hash;
        console.log(user);
        return res.status(statusCodes.OK).json({msg: "Successfully found user!", user: user});
    } catch (error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({error: "Failed to get user"});
    }
});

// update the authenticated user (CHANGE)
router.patch('/update/:email', profilePictureUpload.single('profilePicture'), async (req, res) => {
    try {
        const updatedUserData = req.body;

        const user = await User.findOne({ email: updatedUserData.email });
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({ error: 'Could not find user with email: ' + updatedUserData.email + '!' });
        }

        if (req.file) {
            // if the profile picture already exists, delete it as we have uploaded a new one
            if (user.profilePictureURL) {
                fs.unlinkSync(path.join(__dirname, "../uploads/profile", user.profilePictureURL));
            }
            updatedUserData.profilePictureURL = req.file.filename;
        }

        const updatedUser = await User.findOneAndUpdate({ email: updatedUserData.email }, updatedUserData, {new: true});

        if (!updatedUser) {
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Could not update user with email: ' + updatedUserData.email + '!' });
        }

        res.status(statusCodes.OK).json({ msg: 'Successfully updated user', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

module.exports = router;