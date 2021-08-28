const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io')
const io = socketio(server, {
    cors: {
        origin: "*"
    }
});
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');
const cors = require("cors");
const pool = require("./db");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// POSTS

// Create
app.post("/posts", async (req, res) => {    
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
app.get("/posts", async (req, res) => {
    try {
        const allPosts = await pool.query("SELECT * FROM posts ORDER BY post_id DESC");
        res.json(allPosts.rows);
    } catch (error) {
        console.log(error.message);
    }
});

// Get all from specified user
app.get("/posts/user/:id", async (req, res) => {
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
app.get("/posts/following/:id", async (req, res) => {
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
        console.log(req.body)
        const {user_email, user_name, img_url} = req.body;
        console.log("Username: " + user_name + ", Email: " + user_email + ", Image URL: " + img_url);
        const newProfile = await pool.query(
            "INSERT INTO profiles (user_email, user_name, img_url, profiles_following, primary_color, dark_mode) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
            [user_email, user_name, img_url, [], '#3f50b5', false]
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

// Get all followed by (ID)
app.get("/profiles/following/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const profile = await pool.query(
            "SELECT * FROM profiles WHERE profile_id = $1",
            [id]
        );
        const following = profile.rows[0].profiles_following
        const allProfiles = await pool.query(
            "SELECT * FROM profiles WHERE profile_id = ANY($1::int[])",
            [following]
        );
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
app.put("/profiles/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {user_email, user_name, img_url, profiles_following, primary_color, dark_mode} = req.body;
        const updatedProfile = await pool.query(
            "UPDATE profiles SET user_email = $1, user_name = $2, img_url = $3, profiles_following = $4, primary_color = $5, dark_mode = $6 WHERE profile_id = $7", 
            [user_email, user_name, img_url, profiles_following, primary_color, dark_mode, id]
        );
        res.json("Profile was updated!");
    } catch (error) {
        console.log(error.message);
    }
});

// Delete
app.delete("/profiles/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const deleteProfile = await pool.query(
            "DELETE FROM profiles WHERE profile_id = $1",
            [id]
        );
        res.json("Profile was deleted!");
    } catch (error) {
        console.log(error.message);
    }
});



app.get("/", async (req, res) => {
    try {
        res.json("Still Working!");
    } catch (error) {
        console.log(error.message);
    }
});


// Live Chat
io.on('connection', (socket) => {

    socket.on('join', ({name, room}, callback) => {
        const {error, user} = addUser({id: socket.id, name, room});

        if (error) return callback(error);

        socket.emit('message', {user: 'Admin', text: `${user.name} welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', {user: 'Admin', text: `${user.name} has joined the room`})

        socket.join(user.room);
        console.log(`User ${user.name} connected`)

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        
        io.to(user.room).emit('message', {user: user.name, text: message});

        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', {user: "Admin", text: `${user.name} has left.`})
            io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
        }
    })
});


app.listen(PORT, () => {
    console.log("Now listening on port: " + PORT);
});