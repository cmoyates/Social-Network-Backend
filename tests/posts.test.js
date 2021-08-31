const request = require("supertest");
const app = require("../app");
const Post = require("../models/post");
const Profile = require("../models/profile");

describe('Model Tests', () => {
    let post;

    test('should create a post object', async () => {
        const postObj = new Post(
            7,
            8,
            "userName",
            "img.url",
            "This is a post",
            [8],
            {"commentList": []}
        );
        expect(postObj.post_id).toBe(7);
        expect(postObj.user_id).toBe(8);
        expect(postObj.user_name).toEqual("userName");
        expect(postObj.user_img).toEqual("img.url");
        expect(postObj.content).toEqual("This is a post");
        expect(postObj.likes[0]).toBe(8);
        expect(postObj.comments.commentList.length).toBe(0);
    })
    test('should add a post to the database and retrieve it', async () => {
        post = await Post.create(3, "John Doe", "img.idk", "This is another post");
        const otherPost = await Post.getOne(post.post_id);
        expect(otherPost).toEqual(post);
    })
    test('should get all of the posts', async () => {
        const allPosts = await Post.getAll();
        expect(allPosts.length).toBeGreaterThan(0);
    })
    test('should get all posts made by a profile with a given ID', async () => {
        const allPosts = await Post.getAllByPosterID(post.user_id);
        expect(allPosts.length).toBeGreaterThan(0);
    })
    test('should get all posts made by the profiles that a given profile is following', async () => {
        const allPosts = await Post.getAllFollowedByProfile({profiles_following: [post.user_id]});
        expect(allPosts.length).toBeGreaterThan(0);
    })
    test('should get a post by its ID', async () => {
        const anotherPost = await Post.getOne(post.post_id);
        expect(anotherPost).toEqual(post);
    })
    test('should update a post and retrieve the updated version', async () => {
        post.likes.push(5);
        const {user_id, user_name, user_img, content, likes, comments} = post;
        await Post.update(post.post_id, user_id, user_name, user_img, content, likes, comments);
        const anotherPost = await Post.getOne(post.post_id);
        expect(anotherPost).toEqual(post);
    })
    test('should should delete the post from the database', async () => {
        await Post.deleteOne(post.post_id);
        const anotherPost = await Post.getOne(post.post_id);
        expect(anotherPost).toBe(undefined);
    })
})

describe('API Tests', () => {
    let post2;

    test('should add a post to the database and retrieve it', async () => {
        const res = await request(app).post("/posts").send({
            user_id: 9,
            user_name: "Name Name",
            user_img: "https://youtu.be/dQw4w9WgXcQ",
            content: "This is the API post"
        });
        post2 = res.body;
        const anotherRes = await request(app).get(`/posts/${post2.post_id}`);
        const anotherPost = anotherRes.body;
        expect(anotherPost).toEqual(post2);
    })
    test('should get all of the posts', async () => {
        const res = await request(app).get("/posts/");
        const allPosts = res.body;
        expect(allPosts.length).toBeGreaterThan(0);
    })
    test('should get all posts made by a profile with a given ID', async () => {
        const res = await request(app).get(`/posts/user/${post2.user_id}`);
        const allPosts = res.body;
        expect(allPosts.length).toBeGreaterThan(0);
    })
    test('should get all posts made by the profiles that a given profile is following', async () => {
        const res = await request(app).post("/profiles").send({
            user_email: "email@email.email",
            user_name: "John Doe",
            img_url: "img.img"
        });
        let profile = res.body;
        profile.profiles_following.push(post2.user_id);
        const {user_email, user_name, img_url, profiles_following, primary_color, dark_mode} = profile;
        await request(app).put(`/profiles/${profile.profile_id}`).send({
            user_email,
            user_name,
            img_url,
            profiles_following,
            primary_color,
            dark_mode
        });
        const anotherRes = await request(app).get(`/posts/following/${profile.profile_id}`);
        const allPosts = anotherRes.body;
        expect(allPosts.length).toBeGreaterThan(0);
        await request(app).delete(`/profiles/${profile.profile_id}`);
    })
    test('should get a post by its ID', async () => {
        const res = await request(app).get(`/posts/${post2.post_id}`);
        const anotherPost = res.body;
        expect(anotherPost).toEqual(post2);
    })
    test('should update a post and retrieve the updated version', async () => {
        post2.likes.push(12);
        const {user_id, user_name, user_img, content, likes, comments} = post2;
        await request(app).put(`/posts/${post2.post_id}`).send({
            user_id, user_name, user_img, content, likes, comments
        });
        const res = await request(app).get(`/posts/${post2.post_id}`);
        const anotherPost = res.body;
        expect(anotherPost).toEqual(post2);
    })
    test('should should delete the post from the database', async () => {
        await request(app).delete(`/posts/${post2.post_id}`);
        const res = await request(app).get(`/posts/${post2.post_id}`);
        expect(res.body).toBe("No post exists with that ID");
    })
})

