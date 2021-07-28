const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// POSTS

// Create
app.post("/posts", async (req, res) => {    
    try {
        const {user_id, user_name, user_img, content, likes} = req.body;
        console.log("Username: " + user_name + " (ID: " + user_id + "), Content: " + content + ", Likes: " + likes);
        const newPost = await pool.query(
            "INSERT INTO posts (user_id, user_name, user_img, content, likes) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [user_id, user_name, user_img, content, likes]
        );
        res.json(newPost.rows[0])
    } catch (error) {
        console.log(error.message);
    }
})

// Get all
app.get("/posts", async (req, res) => {
    try {
        const allPosts = await pool.query("SELECT * FROM posts");
        res.json(allPosts.rows);
    } catch (error) {
        console.log(error.message);
    }
});

// Get one
app.get("/posts/:id", async (req, res) => {
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
app.put("/posts/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {user_id, user_name, user_img, content, likes} = req.body;
        const updatedPost = await pool.query(
            "UPDATE posts SET user_id = $1, user_name = $2, user_img = $3, content = $4, likes = $5 WHERE post_id = $6", 
            [user_id, user_name, user_img, content, likes, id]
        );
        res.json("Post was updated!");
    } catch (error) {
        console.log(error.message);
    }
});

// Delete
app.delete("/posts/:id", async (req, res) => {
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

// PROFILES

// Create
app.post("/profiles", async (req, res) => {    
    try {
        const {user_email, user_name, img_url} = req.body;
        console.log("Username: " + user_name + ", Email: " + user_email + ", Image URL: " + img_url);
        const newProfile = await pool.query(
            "INSERT INTO profiles (user_email, user_name, img_url, primary_color, dark_mode) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [user_name, content, likes, null, false]
        );
        res.json(newProfile.rows[0])
    } catch (error) {
        console.log(error.message);
    }
})

// Get all
app.get("/profiles", async (req, res) => {
    try {
        const allProfiles = await pool.query("SELECT * FROM profiles");
        res.json(allProfiles.rows);
    } catch (error) {
        console.log(error.message);
    }
});

// Get one (ID)
app.get("/profiles/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const profile = await pool.query(
            "SELECT * FROM profiles WHERE profile_id = $1",
            [id]
        );
        res.json(profile.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
});

// Get one (Email)
app.get("/profiles/email/:email", async (req, res) => {
    try {
        const {email} = req.params;
        const profile = await pool.query(
            "SELECT * FROM profiles WHERE user_email = $1",
            [email]
        );
        res.json(profile.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
});

// Update
/*app.put("/profiles/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {user_name, content, likes} = req.body;
        const updatedPost = await pool.query(
            "UPDATE posts SET user_name = $1, content = $2, likes = $3 WHERE post_id = $4", 
            [user_name, content, likes, id]
        );
        res.json("Post was updated!");
    } catch (error) {
        console.log(error.message);
    }
});

// Delete
app.delete("/profiles/:id", async (req, res) => {
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
});*/



app.get("/", async (req, res) => {
    try {
        res.json("HomePage");
    } catch (error) {
        console.log(error.message);
    }
});

app.listen(PORT, () => {
    console.log("Now listening on port: " + PORT);
});