const express = require("express");
const post_router = require("./routes/posts");
const profile_router = require("./routes/profiles");
const chat_router = require("./routes/chats");

const app = express();
const cors = require("cors");

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

module.exports = app;