const express = require('express');
const argon2 = require('argon2');
const statusCodes = require('../util/statusCodes');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../models/user');

// sign the user up
router.post('/signup', async (req, res) => {
    try {
        // Extract the relevant data from the request
        const { email, displayname, password } = req.body;

        console.log(email);

        // Validate the data
        if (!email || !password || !displayname) {
            return res.status(statusCodes.BAD_REQUEST).json({ error: "Invalid data, must provide email, password, and display name!" });
        }

        // Check if a user with the same email already exists
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(statusCodes.BAD_REQUEST).json({ error: 'User with that email already exists!' });
        }

        // Hash the password
        const hash = await argon2.hash(password);

        // Create a new user
        const newUser = new User({
            hash: hash,
            displayname: displayname,
            email: email,
        });

        // Save the user
        await newUser.save();

        // encode user data with jwt
        const token = jwt.sign({
            email: newUser.email,
            displayname: newUser.displayname
        }, 'secret123');

        return res.status(statusCodes.CREATED).json({ msg: 'User created', token: token });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: "Could not sign up" });
    }
});

// get the user data (implement jwt and what not later)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        // check if user doesn't exist
        if (!user) {
            return res.status(statusCodes.UNAUTHORIZED).json({ error: "User not found" });
        }

        // check if the password matches its hash
        const hash = user.hash;
        const isValidPassword = await verifyPassword(password, hash);
        if (!isValidPassword) {
            return res.status(statusCodes.UNAUTHORIZED).json({ error: "Invalid password" });
        }

        // encode user data with jwt
        const token = jwt.sign({
            email: user.email,
            displayname: user.displayname
        }, 'secret123');

        console.log(token);

        return res.status(statusCodes.OK).json({ msg: "Login Success!", token: token });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: "Could not log in" });
    }
});

router.post('logout', (req, res) => {
    // TODO: invalid token and what not here
});

async function verifyPassword(password, hash) {
    try {
        return await argon2.verify(hash, password);
    } catch (error) {
        throw new Error('Error verifying password');
    }
}

module.exports = router;