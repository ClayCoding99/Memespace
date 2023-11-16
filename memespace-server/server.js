const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

async function initDB() {
    try {
        const dbString = 'mongodb+srv://cdhunter99:TheEpicMemerLad42@memespacecluster.p0phxjc.mongodb.net/';
        await mongoose.connect(dbString);
        console.log("Connected to db!");

        // Clear the database
        //await mongoose.connection.db.dropDatabase();
        //console.log("Database cleared!");
    } catch (error) {
        console.log(error);
    }
}
initDB();

const port = 8000;

// use the middleware for allowing cors
const allowedOrigins = ['http://localhost:5173'];
const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
};
app.use(cors(corsOptions));

// middleware to parse json
app.use(express.json());

app.use('/uploads', express.static('./v1/uploads'));

// use the middleware to include the auth routes
const authRoutes = require('./v1/auth/auth.js');
const userRoutes = require('./v1/user/user.js');
const postRoutes = require('./v1/post/post.js');
app.use('/v1/auth', authRoutes);

// for testing purposes, make it so that you need to be authenticated to see any data in the app
app.use('/v1/user', userRoutes);
app.use("/v1/post", postRoutes);

// begin the server
app.listen(port, () => {
    console.log("Listening on port " + port + "!");
    console.log("started server!");
});
