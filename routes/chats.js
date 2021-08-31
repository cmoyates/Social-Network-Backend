const express = require('express')
const router  = express.Router()

const chat_controller = require("../controllers/chats");

// Create
router.post("/", chat_controller.create);

// Get one
router.get("/:id", chat_controller.getOne);

// Get one by (room_name)
router.get("/room/:room_name", chat_controller.getOneByRoomName);

// Get all
router.get("/", chat_controller.getAll);

// Get all involving (id)
router.get("/profile/:id", chat_controller.getAllInvolvingID);

// Update
router.put("/:id", chat_controller.update);

// Delete
router.delete("/:id", chat_controller.deleteOne);

module.exports = router;