const express = require("express");
const post_router = require("./routes/posts");
const profile_router = require("./routes/profiles");
const chat_router = require("./routes/chats");
const chat_controller = require("./controllers/chats");
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io')
const io = socketio(server, {
    cors: {
        origin: "*"
    }
});
const {addUser, removeUser, getUser, getUserByProfileID, getUsersInRoom} = require('./users');
const cors = require("cors");
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use("/posts", post_router);
app.use("/profiles", profile_router);
app.use("/chats", chat_router);

app.get("/", async (req, res) => {
    try {
        res.json("Still Working!");
    } catch (error) {
        console.log(error.message);
    }
});


io.on('connection', (socket) => {

    // When a user joins a room
    socket.on('join', ({name, profile_id, room}, callback) => {
        const {error, user} = addUser({id: socket.id, name, profile_id, room});

        if (error) return callback(error);

        socket.join(user.room);
        console.log(`User ${user.name} connected`)

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

        callback();
    })

    // When the user sends a message
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        console.log(message)
        const messageObj = {user: user.name, text: message, from_id: user.profile_id};
        io.to(user.room).emit('message', messageObj);
        chat_controller.updateChatMessages(user, messageObj);

        callback();
    })

    // When a user starts a new chat
    socket.on('newChat', (profile_id) => {

        const otherUser = getUserByProfileID(profile_id)

        if (otherUser) {
            io.to(otherUser.id).emit('chatHasBeenMade');
        }
    })

    // When a user disconnects
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