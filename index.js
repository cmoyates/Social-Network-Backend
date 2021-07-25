const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") 
{
    console.log("Production!");
}

// Create
app.post("/posts", async (req, res) => {    
    try {
        const {user_name, content, likes} = req.body;
        console.log("Username: " + user_name + ", Content: " + content + ", Likes: " + likes);
        const newPost = await pool.query(
            "INSERT INTO posts (user_name, content, likes) VALUES($1, $2, $3) RETURNING *",
            [user_name, content, likes]
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