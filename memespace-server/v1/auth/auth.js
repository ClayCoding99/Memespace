const express = require('express');
const argon2 = require('argon2');
const statusCodes = require('../util/statusCodes');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();
const User = require('../models/user');

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20m'});
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

// obtain a new access token by passing in the refresh token if the access token has expired
router.post('/token', async (req, res) => {
    const refreshToken = req.body.token; 
    if (refreshToken == null) {
        return res.sendStatus(401);
    }
    const tokenExists = await User.findOne({refreshToken: refreshToken});
    if (!tokenExists) {
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) {
            return res.sendStatus(403);
        }
        const accessToken = generateAccessToken({
            email: user.email, 
            displayname: user.displayname
        });
        res.status(statusCodes.OK).json({accessToken: accessToken});
    });
});

// sign the user up
router.post('/signup', async (req, res) => {
    // Extract user data from the body of the request
    const { email, displayname, password } = req.body;

    // Check if all the data is exists
    if (!email || !password || !displayname) {
        return res.status(statusCodes.BAD_REQUEST).json({ error: "Invalid data, must provide email, password, and display name!" });
    }

    try {
        // Check if a user with the same email already exists
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(statusCodes.BAD_REQUEST).json({ error: 'User with that email already exists!' });
        }

        // Hash the password
        const hash = await argon2.hash(password);

        // encode user data with jwt
        const accessToken = generateAccessToken({
            email: newUser.email,
            displayname: newUser.displayname
        });
        const refreshToken = generateRefreshToken({
            email: newUser.email,
            displayname: newUser.displayname
        }); 

        // Create a new user
        const newUser = new User({
            hash: hash,
            displayname: displayname,
            email: email,
            refreshToken: refreshToken,
        });

        // Save the user
        await newUser.save();

        return res.status(statusCodes.CREATED).json({accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: "Could not sign up" });
    }
});

// get the user data 
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });

        // check if user doesn't exist
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // check if the password matches its hash
        const hash = user.hash;
        const isValidPassword = await verifyPassword(password, hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // encode user data with jwt
        const accessToken = generateAccessToken({
            email: user.email,
            displayname: user.displayname
        });
        const refreshToken = generateRefreshToken({
            email: user.email,
            displayname: user.displayname
        }); 

        const updatedUser = await User.updateOne({email: user.email}, {refreshToken: refreshToken});
        if (!updatedUser) {
            return res.status(statusCodes.CONFLICT).json({error: "Could not update users refresh token in mongodb"});
        }

        return res.status(statusCodes.OK).json({accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: "Could not log in" });
    }
});

// invalidate refresh token when logged out
router.delete('/logout', async (req, res) => {
    const refreshToken = req.body.token;
    
    if (!refreshToken) {
        return res.status(401).json({ error: "Must provide a refresh token to log out the user!" });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { refreshToken: refreshToken },
            { refreshToken: null },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(401).json({ error: "Could not remove the refresh token from the user" });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: "Internal server error during logout" });
    }
});

async function verifyPassword(password, hash) {
    try {
        return await argon2.verify(hash, password);
    } catch (error) {
        throw new Error('Error verifying password');
    }
}

module.exports = router;