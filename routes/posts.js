const express = require("express");
const router = express.Router();

const post_controller = require("../controllers/posts");

// Create
router.post("/", post_controller.create)

// Get all
router.get("/", post_controller.getAll);

// Get all from specified user
router.get("/user/:id", post_controller.getAllByPosterID);

// Get all posts by users that a given user is following
router.get("/following/:id", post_controller.getAllFollowedByID);

// Get one
router.get("/:id", post_controller.getOne);

// Update
router.put("/:id", post_controller.update);

// Delete
router.delete("/:id", post_controller.deleteOne);

module.exports = router;