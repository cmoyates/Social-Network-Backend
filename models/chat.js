const pool = require("../db");

class Chat {
    constructor(id, room_name, participants, messages) {
        this.chat_id = id;
        this.room_name = room_name;
        this.participants = participants;
        this.messages = messages;
    }

    static async create(room_name, participants) {
        const newChat = await pool.query(
            "INSERT INTO chats (room_name, participants, messages) VALUES($1, $2, $3) RETURNING *",
            [room_name, participants, {"messageList": []}]
        );
        return newChat.rows[0];
    }

    static async getOne(id) {
        const chat = await pool.query(
            "SELECT * FROM chats WHERE chat_id = $1",
            [id]
        );
        return chat.rows[0];
    }

    static async getOneByRoomName(room_name) {
        const chat = await pool.query(
            "SELECT * FROM chats WHERE room_name = $1",
            [room_name]
        );
        return chat.rows[0];
    }

    static async getAll() {
        const allChats = await pool.query("SELECT * FROM chats ORDER BY chat_id DESC");
        return allChats.rows;
    }

    static async getAllInvolvingID(id) {
        const allChats = await pool.query(
            "SELECT * FROM chats WHERE $1 = (participants[1]->>'profile_id')::int OR $1 = (participants[2]->>'profile_id')::int;",
            [parseInt(id)]    
        );
        return allChats.rows;
    }

    static async update(id, room_name, participants, messages) {
        await pool.query(
            "UPDATE chats SET room_name = $1, participants = $2, messages = $3 WHERE chat_id = $4", 
            [room_name, participants, messages, id]
        );
    }

    static async deleteOne(id) {
        await pool.query(
            "DELETE FROM chats WHERE chat_id = $1",
            [id]
        );
    }
}

module.exports = Chat;