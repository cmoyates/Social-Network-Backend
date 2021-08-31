const Chat = require("../models/chat");


const create = async (req, res) => {    
    try {
        const {room_name, participants} = req.body;
        const new_chat = await Chat.create(room_name, participants);
        res.json(new_chat);
    } catch (error) {
        console.log(error.message);
    }
};

const getOne = async (req, res) => {
    try {
        const {id} = req.params;
        const obj = await Chat.getOne(id);
        res.json(obj);
    } catch (error) {
        console.log(error.message);
    }
};

const getOneByRoomName = async (req, res) => {
    try {
        const {room_name} = req.params;
        const obj = await Chat.getOneByRoomName(room_name);
        res.json(obj);
    } catch (error) {
        console.log(error.message);
    }
};

const getAll = async (req, res) => {
    try {
        const allChats = await Chat.getAll();
        res.json(allChats);
    } catch (error) {
        console.log(error.message);
    }
};

const getAllInvolvingID = async (req, res) => {
    try {
        const {id} = req.params;
        const allChats = await Chat.getAllInvolvingID(id);
        res.json(allChats);
    } catch (error) {
        console.log(error.message);
    }
};

const update = async (req, res) => {
    try {
        const {id} = req.params;
        const {room_name, participants, messages} = req.body;
        await Chat.update(id, room_name, participants, messages);
        res.json("Chat was updated!");
    } catch (error) {
        console.log(error.message);
    }
};

const deleteOne = async (req, res) => {
    try {
        const {id} = req.params;
        await Chat.deleteOne(id);
        res.json("Chat was deleted!");
    } catch (error) {
        console.log(error.message);
    }
};


const updateChatMessages = async (user, message) => {
    let obj = await Chat.getOneByRoomName(user.room);
    obj.messages.messageList.push(message);
    const {chat_id, room_name, participants, messages} = obj;
    await Chat.update(chat_id, room_name, participants, messages);
}


module.exports = {
    create,
    getOne,
    getOneByRoomName,
    getAll,
    getAllInvolvingID,
    update,
    deleteOne,
    updateChatMessages
};