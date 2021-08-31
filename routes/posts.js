const express = require("express");
const router = express.Router();

// Create
router.post("/", async (req, res) => {    
    try {
        const {user_id, user_name, user_img, content} = req.body;
        console.log("Username: " + user_name + " (ID: " + user_id + "), Content: " + content);
        const newPost = await pool.query(
            "INSERT INTO posts (user_id, user_name, user_img, content, likes, comments) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
            [user_id, user_name, user_img, content, [], {"commentList": []}]
        );
        res.json(newPost.rows[0])
    } catch (error) {
        console.log(error.message);
    }
})

// Get all
router.get("/", async (req, res) => {
    try {
        const allPosts = await pool.query("SELECT * FROM posts ORDER BY post_id DESC");
        res.json(allPosts.rows);
    } catch (error) {
        console.log(error.message);
    }
});

// Get all from specified user
router.get("/user/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const allPosts = await pool.query(
            "SELECT * FROM posts WHERE user_id = $1 ORDER BY post_id DESC",
            [id]
        );
        res.json(allPosts.rows);
    } catch (error) {
        console.log(error.message);
    }
});

// Get all posts by users that a given user is following
router.get("/following/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const profile = await pool.query(
            "SELECT * FROM profiles WHERE profile_id = $1",
            [id]
        );
        const allPosts = await pool.query(
            "SELECT * FROM posts WHERE user_id = ANY($1::int[]) ORDER BY post_id DESC",
            [profile.rows[0].profiles_following]
        );
        res.json(allPosts.rows);
    } catch (error) {
        console.log(error.message);
    }
});

// Get one
router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const post = await pool.query(
            "SELECT * FROM posts WHERE post_id = $1",
            [id]
        );
        res.json(post.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
});

// Update
router.put("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {user_id, user_name, user_img, content, likes, comments} = req.body;
        const updatedPost = await pool.query(
            "UPDATE posts SET user_id = $1, user_name = $2, user_img = $3, content = $4, likes = $5, comments = $6 WHERE post_id = $7", 
            [user_id, user_name, user_img, content, likes, comments, id]
        );
        res.json("Post was updated!");
    } catch (error) {
        console.log(error.message);
    }
});

// Delete
router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const deletePost = await pool.query(
            "DELETE FROM posts WHERE post_id = $1",
            [id]
        );
        res.json("Post was deleted!");
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;