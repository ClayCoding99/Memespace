const express = require('express');
const router = express.Router();
const statusCodes = require('../util/statusCodes');
const Post = require('../models/post');
const { postUpload } = require('../middleware/upload');
const authenticateToken = require('../middleware/authenticateToken');

// get posts based on query params (can be done by anyone)
router.get('/', async (req, res) => {
    const { limit = 0, after = 0, asc = 'true', sortType = null } = req.query;
    const parsedLimit = parseInt(limit);
    const parsedAfter = parseInt(after);
    const parsedAsc = asc === 'true'; // Convert to boolean
    
    try {
        // set up sort criteria
        let sortDirection = parsedAsc ? 1 : -1; 
        let sortCriteria = {};
        
        if (sortType !== null) {
            if (sortType === 'createdAt' || sortType === 'updatedAt' || sortType === 'title') {
                sortCriteria[sortType] = sortDirection;
            } else {
                return res.status(statusCodes.BAD_REQUEST).json({ error: "Can only sort by 'createdAt', 'updatedAt', or 'title'!" });
            }
        }

        // Find posts with sorting and limit
        let posts = await Post.find({}).sort(sortCriteria).skip(parsedAfter).limit(parsedLimit);

        // calculate how old the post is (DO LATER)
        const postWithTime = await Promise.all(posts.map(async (post) => {
            return post;
            // Assuming you want to return the post along with its age
            const currentTime = Date.now();
            const postAge = currentTime - post.createdAt;
            return { post, postAge };
        }));

        return res.status(statusCodes.OK).json({ posts: postWithTime });
    } catch (error) {
        console.log(error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
    }
});

// delete post based on post id
router.delete('/delete/:postID', async (req, res) => {
    try {
        const postID = req.params.postID;
        if (!postID) {
            return res.status(statusCodes.BAD_REQUEST).json({error: "Must provide a post id!"});
        }
        const postDeleted = await Post.deleteOne({"_id": postID});
        return res.status(statusCodes.OK).json({msg: "Post succesfully deleted!", post: postDeleted});
    } catch (error) {
        console.log(error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({error: error});
    }
});

// create post 
router.post('/create', postUpload.single('file'), async (req, res) => {
    try {
        const { userID, title, description, fileType } = req.body;
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
            fileType: fileType,
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

// get post based on the user who made the post
router.get("/userPost", authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        console.log("TEST: " + email);
        if (!email) {
            return res.status(statusCodes.BAD_REQUEST).json({error: "Must provide a user email to obtain their posts!"});
        }
        const userPosts = await Post.find({userID: email});
        if (!userPosts) {
            return res.status(statusCodes.CONFLICT).json({error: "Failed to find user posts"}); 
        }
        return res.status(statusCodes.OK).json({userPosts: userPosts});
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({error: error});
    }
});

module.exports = router;