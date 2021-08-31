const app = require("./app");

const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server, {
    cors: {
        origin: "*"
    }
});
const chat_controller = require("./controllers/chats");
const {addUser, removeUser, getUser, getUserByProfileID, getUsersInRoom} = require('./users');


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


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("Now listening on port: " + PORT);
});