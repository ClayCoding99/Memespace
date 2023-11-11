const express = require('express');
const router = express.Router();
const statusCodes = require('../util/statusCodes');

const Post = require('../models/post');

const { postUpload } = require('../middleware/upload');

router.get('/:sortType/:asc/:limit/:after', async (req, res) => {
    const limit = req.params.limit || 0;
    const after = req.params.after || 0; 
    const asc = req.params.asc || false;
    const sortType = req.params.sortType || null;
    try {
        // set up sort criteria
        let sortDirection = asc ? 1 : -1; 
        let sortCriteria = {};
        if (sortType !== null) {
            if (sortType === "createdAt" || sortType === "updatedAt" || sortType === "title") {
                sortCriteria[sortType] = sortDirection;
            } else {
                return res.status(statusCodes.BAD_REQUEST).json({error: "Can only sort by 'createdAt', 'updatedAt', or 'title'!"});
            }
        }

        // Find posts with sorting and limit
        const posts = await Post.find({}).sort(sortCriteria).skip(after).limit(limit);
        return res.status(statusCodes.OK).json({posts: posts});
    } catch (error) {
        console.log(error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({error: error});
    }
});

router.post('/create', postUpload.single('file'), async (req, res) => {
    try {
        const { userID, title, description } = req.body;
        if (!req.file) {
            return res.status(statusCodes.BAD_REQUEST).json({error: "File was not uploaded!"});
        }
        if (!userID) {
            return res.status(statusCodes.BAD_REQUEST).json({error: "Must provide the user id to be able to upload the post!"});
        }
        const post = new Post({
            userID: userID,
            title: title,
            fileURL: req.file.filename,
            description: description,
        });
        const savedPost = await post.save();
        if (!savedPost) {
            return res.status(statusCodes.CONFLICT).json({error: "failed to save post to the database!"});
        }
        console.log(savedPost);
        return res.status(statusCodes.OK).json({post: savedPost});
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({error: error}); 
    }
});

router.get("/:userID", async (req, res) => {
    try {
        const userID = req.params.userID;
        if (!userID) {
            return res.status(statusCodes.BAD_REQUEST).json({error: "Must provide a userID!"});
        }
        const userPosts = await Post.find({userID: userID});
        if (!userPosts) {
            return res.status(statusCodes.CONFLICT).json({error: "Failed to find user posts"}); 
        }
        return res.status(statusCodes.OK).json({userPosts: userPosts});
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({error: error});
    }
});

module.exports = router;