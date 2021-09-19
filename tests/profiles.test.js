const request = require("supertest");
const app = require("../app");
const Profile = require("../models/profile");

describe('Model Tests', () => {

    let profile;

    test('should create a profile object', () => {
        const profileObj = new Profile(
            11,
            "email@email.email",
            "Name Name",
            "img.url",
            [11]
        );
        expect(profileObj.profile_id).toBe(11);
        expect(profileObj.user_email).toEqual("email@email.email");
        expect(profileObj.user_name).toEqual("Name Name");
        expect(profileObj.img_url).toEqual("img.url");
        expect(profileObj.profiles_following[0]).toBe(11);
    })
    test('should add a post to the database and retrieve it', async () => {
        profile = await Profile.create(
            "email@gmail.com",
            "John Doe",
            "img.png"
        );
        const anotherProfile = await Profile.getOne(profile.profile_id);
        expect(anotherProfile).toEqual(profile);
    })
    test('should get all of the profiles', async () => {
        const allProfiles = await Profile.getAll();
        expect(allProfiles.length).toBeGreaterThan(0);
    })
    test('should update a profile and retrieve the updated version', async () => {
        profile.profiles_following.push(profile.profile_id);
        const {user_email, user_name, img_url, profiles_following} = profile;
        await Profile.update(
            profile.profile_id,
            user_email,
            user_name,
            img_url,
            profiles_following
        );
        const anotherProfile = await Profile.getOne(profile.profile_id);
        expect(anotherProfile).toEqual(profile);
    })
    test('should get all of the profiles followed by a given profile', async () => {
        const allProfiles = await Profile.getAllFollowedByID(profile.profile_id);
        expect(allProfiles.length).toBeGreaterThan(0);
    })
    test('should get one profile by its ID', async () => {
        const anotherProfile = await Profile.getOne(profile.profile_id);
        expect(anotherProfile).toEqual(profile);
    })
    test('should get one profile by email', async () => {
        const anotherProfile = await Profile.getOneByEmail(profile.user_email);
        expect(anotherProfile).toEqual(profile);
    })
    test('should should delete the profile from the database', async () => {
        await Profile.deleteOne(profile.profile_id);
        const anotherProfile = await Profile.getOne(profile.profile_id);
        expect(anotherProfile).toBe(undefined);
    })
    
})

describe('API Tests', () => {

    let profile2;

    test('should add a post to the database and retrieve it', async () => {
        const res = await request(app).post("/profiles").send({
            user_email: "email@web.site",
            user_name: "John Johnson",
            img_url: "img.url"
        })
        profile2 = res.body;
        expect(profile2.user_email).toEqual("email@web.site");
        expect(profile2.user_name).toEqual("John Johnson");
        expect(profile2.img_url).toEqual("img.url");
    })
    test('should get all of the profiles', async () => {
        const res = await request(app).get("/profiles");
        const allProfiles = res.body;
        expect(allProfiles.length).toBeGreaterThan(0);
    })
    test('should update a post and profile the updated version', async () => {
        profile2.profiles_following.push(profile2.profile_id);
        const {user_email, user_name, img_url, profiles_following} = profile2;
        await request(app).put(`/profiles/${profile2.profile_id}`).send({
            user_email, user_name, img_url, profiles_following
        });
        const res = await request(app).get(`/profiles/${profile2.profile_id}`);
        const anotherProfile = res.body;
        expect(anotherProfile).toEqual(profile2);
    })
    test('should get all of the profiles followed by a given profile', async () => {
        const res = await request(app).get(`/profiles/following/${profile2.profile_id}`);
        const allProfiles = res.body;
        expect(allProfiles.length).toBeGreaterThan(0);
    })
    test('should get one profile by its ID', async () => {
        const res = await request(app).get(`/profiles/${profile2.profile_id}`);
        const anotherProfile = res.body;
        expect(anotherProfile).toEqual(profile2);
    })
    test('should get one profile by email', async () => {
        const res = await request(app).get(`/profiles/email/${profile2.user_email}`);
        const anotherProfile = res.body;
        expect(anotherProfile).toEqual(profile2);
    })
    test('should should delete the profile from the database', async () => {
        await request(app).delete(`/profiles/${profile2.profile_id}`);
        const res = await request(app).get(`/profiles/${profile2.profile_id}`);
        expect(res.body).toEqual("No profiles exist with that ID");
    })
})
