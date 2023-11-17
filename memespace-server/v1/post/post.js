const express = require('express');
const router = express.Router();
const statusCodes = require('../util/statusCodes');
const Post = require('../models/post');
const { postUpload } = require('../middleware/upload');
const authenticateToken = require('../middleware/authenticateToken');

// get all posts based on query params (can be done by anyone)
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

// get all the posts of the corresponding user email
router.get("/:email", authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
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

// create post for the authenticated user
router.post('/create', authenticateToken, postUpload.single('file'), async (req, res) => {
    try {
        const email = req.user.email;
        const { title, description, fileType } = req.body;
        if (!req.file) {
            return res.status(400).json({error: "File was not uploaded!"});
        }
        if (!email) {
            return res.status(400).json({error: "Must provide the user id to be able to upload the post!"});
        }
        const post = new Post({
            userID: email,
            title: title,
            fileURL: req.file.filename,
            fileType: fileType,
            description: description,
        });
        const savedPost = await post.save();
        if (!savedPost) {
            return res.status(500).json({error: "failed to save post to the database!"});
        }
        return res.status(201).json({post: savedPost});
    } catch (error) {
        return res.status(500).json({error: error}); 
    }
});

// delete a post based on id. User must be authenticated and must be their post 
router.delete('/delete/:postID', authenticateToken, async (req, res) => {
    try {
        const postID = req.params.postID;
        if (!postID) {
            return res.status(400).json({error: "Must provide a post id!"});
        }
        // search and see if the post is actually theirs
        const post = await Post.findOne({"_id": postID});
        if (!post) {
            return res.status(404).json({error: "post with id " + postID + " does not exist!"});
        }
        if (post.userID !== req.user.email) {
            return res.status(403).json({error: "cannot delete a post that is not yours!"});
        }
        const postDeleted = await Post.deleteOne({"_id": postID});
        return res.status(200).json({msg: "Post succesfully deleted!", post: postDeleted});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error});
    }
});

module.exports = router;