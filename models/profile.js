const pool = require("../db");

class Profile {
    constructor(id, user_email, user_name, img_url, profiles_following) {
        this.profile_id = id;
        this.user_email = user_email;
        this.user_name = user_name;
        this.img_url = img_url;
        this.profiles_following = profiles_following;
    }

    static async create(user_email, user_name, img_url) {
        const newProfile = await pool.query(
            "INSERT INTO profiles (user_email, user_name, img_url, profiles_following) VALUES($1, $2, $3, $4) RETURNING *",
            [user_email, user_name, img_url, []]
        );
        return newProfile.rows[0];
    }

    static async getAll() {
        const allProfiles = await pool.query("SELECT * FROM profiles");
        return allProfiles.rows;
    }

    static async getAllFollowedByID(id) {
        const profile = await this.getOne(id);
        const following = profile.profiles_following;
        const allProfiles = await pool.query(
            "SELECT * FROM profiles WHERE profile_id = ANY($1::int[])",
            [following]
        );
        return allProfiles.rows;
    }

    static async getOne(id) {
        const profile = await pool.query(
            "SELECT * FROM profiles WHERE profile_id = $1",
            [id]
        );
        return profile.rows[0];
    }

    static async getOneByEmail(email) {
        const profile = await pool.query(
            "SELECT * FROM profiles WHERE user_email = $1",
            [email]
        );
        return profile.rows[0];
    }

    static async update(id, user_email, user_name, img_url, profiles_following) {
        await pool.query(
            "UPDATE profiles SET user_email = $1, user_name = $2, img_url = $3, profiles_following = $4 WHERE profile_id = $5", 
            [user_email, user_name, img_url, profiles_following, id]
        );
    }

    static async deleteOne(id) {
        await pool.query(
            "DELETE FROM profiles WHERE profile_id = $1",
            [id]
        );
    }
}

module.exports = Profile;