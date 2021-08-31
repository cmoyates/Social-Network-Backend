const request = require("supertest");
const app = require("../app");
const Chat = require("../models/chat");
const chat_controller = require("../controllers/chats");



describe('Model Tests', () => {

    let chat;

    test('should properly create a chat object', () => {
        const chatObj = new Chat(
            7,
            "another_room",
            [{name: "userName"}],
            {messageList: []}
        );
        expect(chatObj.chat_id).toBe(7);
        expect(chatObj.room_name).toEqual("another_room");
        expect(chatObj.participants[0].name).toEqual("userName");
        expect(chatObj.messages.messageList.length).toBe(0);
    })
    
    test('should add a chat to the database and retrieve it', async () => {
        chat = await Chat.create("test_room", [{profile_id: 3}, {profile_id: 4}]);
        const otherChat = await Chat.getOne(chat.chat_id);
        expect(otherChat).toEqual(chat);
    })
    test('should get the chat by using the room name', async () => {
        const otherChat = await Chat.getOneByRoomName(chat.room_name);
        expect(otherChat).toEqual(chat);
    })
    test('should get all of the chats', async () => {
        const allChats = await Chat.getAll();
        expect(allChats.length).toBeGreaterThan(0);
    })
    test('should do get all chats involving the user with the ID 4', async () => {
        const allChats = await Chat.getAllInvolvingID(4);
        expect(allChats.length).toBeGreaterThan(0);
    })
    test('should update the chat and retrieve the updated version', async () => {
        chat.messages.messageList.push(1);
        const {chat_id, room_name, participants, messages} = chat;
        await Chat.update(chat_id, room_name, participants, messages);
        const anotherChat = await Chat.getOne(chat_id);
        expect(anotherChat.messages.messageList).toEqual(chat.messages.messageList);
    })
    test('should delete the chat from the database', async () => {
        await Chat.deleteOne(chat.chat_id);
        const anotherChat = await Chat.getOne(chat.chat_id);
        expect(anotherChat).toBe(undefined);
    })
})



describe('API Tests', () => {

    let chat2;

    test('should add a chat to the database and retrieve it', async () => {
        const res = await request(app).post("/chats").send({room_name: "test_room_2", participants: [{profile_id: 5}, {profile_id: 4}]});
        chat2 = res.body;
        const anotherRes = await request(app).get(`/chats/${chat2.chat_id}`);
        const anotherChat = anotherRes.body;
        expect(anotherChat).toEqual(chat2);
    })
    test('should get the chat by using the room name', async () => {
        const res = await request(app).get(`/chats/room/${chat2.room_name}`);
        const anotherChat = res.body;
        expect(anotherChat).toEqual(chat2);
    })
    test('should get all of the chats', async () => {
        const res =  await request(app).get("/chats");
        const allChats = res.body;
        expect(allChats.length).toBeGreaterThan(0);
    })
    test('should do get all chats involving the user with the ID 4', async () => {
        const res = await request(app).get(`/chats/profile/${4}`);
        const allChats = res.body;
        expect(allChats.length).toBeGreaterThan(0);
    })
    test('should update the chat and retrieve the updated version', async () => {
        chat2.messages.messageList.push(2);
        const {chat_id, room_name, participants, messages} = chat2;
        await request(app).put(`/chats/${chat_id}`).send({room_name, participants, messages})
        const res = await request(app).get(`/chats/${chat_id}`);
        const anotherChat = res.body;
        expect(anotherChat.messages.messageList).toEqual(chat2.messages.messageList);
    })
    test('should delete the chat from the database', async () => {
        await request(app).delete(`/chats/${chat2.chat_id}`);
        const res = await request(app).get(`/chats/${chat2.chat_id}`);
        expect(res.body).toEqual("No chat exists with that ID");
    })
})



describe('Other Tests', () => {
    test('should add a message to a chat', async () => {
        const chat3 = await Chat.create("test_room_3", []);
        await chat_controller.updateChatMessages({room: "test_room_3"}, "Test Message");
        const anotherChat = await Chat.getOne(chat3.chat_id);
        expect(anotherChat.messages.messageList[0]).toEqual("Test Message");
        await Chat.deleteOne(chat3.chat_id);
    })
})
