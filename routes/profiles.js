const express = require('express');
const router  = express.Router();

const profile_controller = require("../controllers/profiles");

// Create
router.post("/", profile_controller.create)

// Get all
router.get("/", profile_controller.getAll);

// Get all followed by (ID)
router.get("/following/:id", profile_controller.getAllFollowedByID);

// Get one (ID)
router.get("/:id", profile_controller.getOne);

// Get one (Email)
router.get("/email/:email", profile_controller.getOneByEmail);

// Update
router.put("/:id", profile_controller.update);

// Delete
router.delete("/:id", profile_controller.deleteOne);

module.exports = router;