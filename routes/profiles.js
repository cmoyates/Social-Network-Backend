const express = require('express')
const router  = express.Router()

// Create
router.post("/", async (req, res) => {    
    try {
        console.log(req.body)
        const {user_email, user_name, img_url} = req.body;
        console.log("Username: " + user_name + ", Email: " + user_email + ", Image URL: " + img_url);
        const newProfile = await pool.query(
            "INSERT INTO profiles (user_email, user_name, img_url, profiles_following, primary_color, dark_mode) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
            [user_email, user_name, img_url, [], '#3f50b5', false]
        );
        res.json(newProfile.rows[0])
    } catch (error) {
        console.log(error.message);
    }
})

// Get all
router.get("/", async (req, res) => {
    try {
        const allProfiles = await pool.query("SELECT * FROM profiles");
        res.json(allProfiles.rows);
    } catch (error) {
        console.log(error.message);
    }
});

// Get all followed by (ID)
router.get("/following/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const profile = await pool.query(
            "SELECT * FROM profiles WHERE profile_id = $1",
            [id]
        );
        const following = profile.rows[0].profiles_following
        const allProfiles = await pool.query(
            "SELECT * FROM profiles WHERE profile_id = ANY($1::int[])",
            [following]
        );
        res.json(allProfiles.rows);
    } catch (error) {
        console.log(error.message);
    }
});

// Get one (ID)
router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const profile = await pool.query(
            "SELECT * FROM profiles WHERE profile_id = $1",
            [id]
        );
        res.json(profile.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
});

// Get one (Email)
router.get("/email/:email", async (req, res) => {
    try {
        const {email} = req.params;
        const profile = await pool.query(
            "SELECT * FROM profiles WHERE user_email = $1",
            [email]
        );
        res.json(profile.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
});

// Update
router.put("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {user_email, user_name, img_url, profiles_following, primary_color, dark_mode} = req.body;
        const updatedProfile = await pool.query(
            "UPDATE profiles SET user_email = $1, user_name = $2, img_url = $3, profiles_following = $4, primary_color = $5, dark_mode = $6 WHERE profile_id = $7", 
            [user_email, user_name, img_url, profiles_following, primary_color, dark_mode, id]
        );
        res.json("Profile was updated!");
    } catch (error) {
        console.log(error.message);
    }
});

// Delete
router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const deleteProfile = await pool.query(
            "DELETE FROM profiles WHERE profile_id = $1",
            [id]
        );
        res.json("Profile was deleted!");
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;