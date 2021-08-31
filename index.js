const express = require("express");
const post_router = require("./routes/posts");
const profile_router = require("./routes/profiles");
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io')
const io = socketio(server, {
    cors: {
        origin: "*"
    }
});
const {addUser, removeUser, getUser, getUserByProfileID, getUsersInRoom, usersList} = require('./users');
const cors = require("cors");
const pool = require("./db");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/posts", post_router);
app.use("/profiles", profile_router);



// Chats

// Create
app.post("/chats", async (req, res) => {    
    try {
        const {room_name, participants} = req.body;
        console.log("Room name: " + room_name);
        const newChat = await pool.query(
            "INSERT INTO chats (room_name, participants, messages) VALUES($1, $2, $3) RETURNING *",
            [room_name, participants, {"messageList": []}]
        );
        res.json(newChat.rows[0])
    } catch (error) {
        console.log(error.message);
    }
})

// Get one
app.get("/chats/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const chat = await pool.query(
            "SELECT * FROM chats WHERE chat_id = $1",
            [id]
        );
        res.json(chat.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
});

// Get one by (room_name)
app.get("/chats/room/:room_name", async (req, res) => {
    try {
        const {room_name} = req.params;
        const chat = await pool.query(
            "SELECT * FROM chats WHERE room_name = $1",
            [room_name]
        );
        res.json(chat.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
});
const getOneChatByRoomName = async (room_name) => {
    const chat = await pool.query(
        "SELECT * FROM chats WHERE room_name = $1",
        [room_name]
    );
    return chat.rows[0];
}

// Get all
app.get("/chats", async (req, res) => {
    try {
        const allChats = await pool.query("SELECT * FROM chats ORDER BY chat_id DESC");
        res.json(allChats.rows);
    } catch (error) {
        console.log(error.message);
    }
});

// Get all involving (id)
app.get("/chats/profile/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const allChats = await pool.query(
            "SELECT * FROM chats WHERE $1 = (participants[1]->>'profile_id')::int OR $1 = (participants[2]->>'profile_id')::int;",
            [parseInt(id)]    
        );
        res.json(allChats.rows);
    } catch (error) {
        console.log(error.message);
    }
});

// Update
app.put("/chats/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {room_name, participants, messages} = req.body;
        const updatedChat = await pool.query(
            "UPDATE chats SET room_name = $1, participants = $2, messages = $3 WHERE chat_id = $4", 
            [room_name, participants, messages, id]
        );
        res.json("Chat was updated!");
    } catch (error) {
        console.log(error.message);
    }
});
const updateChat = async (chat) => {
    const {chat_id, room_name, participants, messages} = chat;
    await pool.query(
        "UPDATE chats SET room_name = $1, participants = $2, messages = $3 WHERE chat_id = $4", 
        [room_name, participants, messages, chat_id]
    );
}

// Delete
app.delete("/chats/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const deleteChat = await pool.query(
            "DELETE FROM chats WHERE chat_id = $1",
            [id]
        );
        res.json("Chat was deleted!");
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


const updateChatMessages = async (user, message) => {
    let chat = await getOneChatByRoomName(user.room);
    chat.messages.messageList.push(message);
    await updateChat(chat);
}


// Live Chat
io.on('connection', (socket) => {

    socket.on('join', ({name, profile_id, room}, callback) => {
        const {error, user} = addUser({id: socket.id, name, profile_id, room});

        if (error) return callback(error);

        socket.join(user.room);
        console.log(`User ${user.name} connected`)

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        console.log(message)
        const messageObj = {user: user.name, text: message, from_id: user.profile_id};
        io.to(user.room).emit('message', messageObj);
        updateChatMessages(user, messageObj);

        callback();
    })

    socket.on('newChat', (profile_id) => {

        const otherUser = getUserByProfileID(profile_id)

        console.log(otherUser);
        if (otherUser) {
            io.to(otherUser.id).emit('chatHasBeenMade');
        }
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
        }
    })
});


server.listen(PORT, () => {
    console.log("Now listening on port: " + PORT);
});