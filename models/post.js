const pool = require("../db");

class Post {
    constructor(id, user_id, user_name, user_img, content, likes, comments) {
        this.post_id = id;
        this.user_id = user_id;
        this.user_name = user_name;
        this.user_img = user_img;
        this.content = content;
        this.likes = likes;
        this.comments = comments;
    }

    static async create(user_id, user_name, user_img, content) {
        const newPost = await pool.query(
            "INSERT INTO posts (user_id, user_name, user_img, content, likes, comments) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
            [user_id, user_name, user_img, content, [], {"commentList": []}]
        );
        return newPost.rows[0]
    }

    static async getAll() {
        const allPosts = await pool.query("SELECT * FROM posts ORDER BY post_id DESC");
        return allPosts.rows;
    }

    static async getAllByPosterID(id) {
        const allPosts = await pool.query(
            "SELECT * FROM posts WHERE user_id = $1 ORDER BY post_id DESC",
            [id]
        );
        return allPosts.rows;
    }

    static async getAllFollowedByProfile(profile) {
        const allPosts = await pool.query(
            "SELECT * FROM posts WHERE user_id = ANY($1::int[]) ORDER BY post_id DESC",
            [profile.profiles_following]
        );
        return allPosts.rows;
    }

    static async getOne(id) {
        const post = await pool.query(
            "SELECT * FROM posts WHERE post_id = $1",
            [id]
        );
        return post.rows[0];
    }

    static async update(id, user_id, user_name, user_img, content, likes, comments) {
        await pool.query(
            "UPDATE posts SET user_id = $1, user_name = $2, user_img = $3, content = $4, likes = $5, comments = $6 WHERE post_id = $7", 
            [user_id, user_name, user_img, content, likes, comments, id]
        );
    }

    static async deleteOne(id) {
        await pool.query(
            "DELETE FROM posts WHERE post_id = $1",
            [id]
        );
    }
}

module.exports = Post;