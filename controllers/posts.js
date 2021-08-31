const Post = require("../models/post");
const Profile = require("../models/profile");

const create = async (req, res) => {    
    try {
        const {user_id, user_name, user_img, content} = req.body;
        const newPost = await Post.create(user_id, user_name, user_img, content);
        res.json(newPost)
    } catch (error) {
        console.log(error.message);
    }
}

const getAll = async (req, res) => {
    try {
        const allPosts = await Post.getAll();
        res.json(allPosts);
    } catch (error) {
        console.log(error.message);
    }
}

const getAllByPosterID = async (req, res) => {
    try {
        const {id} = req.params;
        const allPosts = await Post.getAllByPosterID(id);
        res.json(allPosts);
    } catch (error) {
        console.log(error.message);
    }
}

const getAllFollowedByID = async (req, res) => {
    try {
        const {id} = req.params;
        const profile = await Profile.getOne(id);
        const allPosts = await Post.getAllFollowedByProfile(profile);
        res.json(allPosts);
    } catch (error) {
        console.log(error.message);
    }
}

const getOne = async (req, res) => {
    try {
        const {id} = req.params;
        const obj = await Post.getOne(id);
        res.json(obj);
    } catch (error) {
        console.log(error.message);
    }
}

const update = async (req, res) => {
    try {
        const {id} = req.params;
        const {user_id, user_name, user_img, content, likes, comments} = req.body;
        await Post.update(id, user_id, user_name, user_img, content, likes, comments);
        res.json("Post was updated!");
    } catch (error) {
        console.log(error.message);
    }
}

const deleteOne = async (req, res) => {
    try {
        const {id} = req.params;
        await Post.deleteOne(id);
        res.json("Post was deleted!");
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    create,
    getAll,
    getAllByPosterID,
    getAllFollowedByID,
    getOne,
    update,
    deleteOne
};