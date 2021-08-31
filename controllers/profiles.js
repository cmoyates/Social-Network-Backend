const Profile = require("../models/profile");

const create = async (req, res) => {    
    try {
        const {user_email, user_name, img_url} = req.body;
        const newProfile = await Profile.create(user_email, user_name, img_url);
        res.json(newProfile)
    } catch (error) {
        console.log(error.message);
    }
}

const getAll = async (req, res) => {
    try {
        const allProfiles = await Profile.getAll();
        res.json(allProfiles);
    } catch (error) {
        console.log(error.message);
    }
}

const getAllFollowedByID = async (req, res) => {
    try {
        const {id} = req.params;
        const allProfiles = await Profile.getAllFollowedByID(id);
        res.json(allProfiles);
    } catch (error) {
        console.log(error.message);
    }
}

const getOne = async (req, res) => {
    try {
        const {id} = req.params;
        const obj = await Profile.getOne(id);
        res.json((obj) ? obj : "No profiles exist with that ID");
    } catch (error) {
        console.log(error.message);
    }
}

const getOneByEmail = async (req, res) => {
    try {
        const {email} = req.params;
        const obj = await Profile.getOneByEmail(email);
        res.json(obj);
    } catch (error) {
        console.log(error.message);
    }
}

const update = async (req, res) => {
    try {
        const {id} = req.params;
        const {user_email, user_name, img_url, profiles_following, primary_color, dark_mode} = req.body;
        await Profile.update(id, user_email, user_name, img_url, profiles_following, primary_color, dark_mode);
        res.json("Profile was updated!");
    } catch (error) {
        console.log(error.message);
    }
}

const deleteOne = async (req, res) => {
    try {
        const {id} = req.params;
        await Profile.deleteOne(id);
        res.json("Profile was deleted!");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    create,
    getAll,
    getAllFollowedByID,
    getOne,
    getOneByEmail,
    update,
    deleteOne
};