const request = require("supertest");
const app = require("../app");

describe('API Tests', () => {
    test('should say that the app is still working', async () => {
        const res = await request(app).get("/");
        expect(res.body).toEqual("Still Working!");
    })
})
