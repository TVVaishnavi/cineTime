const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/server");
const Activity = require("../src/model/movies/activity");
const database = require("../src/patterns/singleton/database");

beforeAll(async () => {
  await database.getConnection();
});

afterAll(async () => {
  await database.closeConnection();
});


describe("Activity Routes", () => {
    const mockActivity = {
        name: "Movie Screening",
        timing: new Date("2025-04-10T18:00:00Z"),
        price: "500",
        description: "An exciting movie screening event",
        duration: 120,
        location: "Main Theater",
        imageURL: "https://example.com/movie.jpg"
    };

    beforeAll(async () => {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
        await Activity.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        await Activity.deleteMany({});
    });

    test("POST /Activity/create - should create an activity", async () => {
        const response = await request(app)
            .post("/api/Activity/create")
            .send(mockActivity);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Activity created successfully");
        expect(response.body.Activity).toBeTruthy();
        expect(response.body.Activity.name).toBe(mockActivity.name);
    });

    test("GET /Activity/all - should return all activities", async () => {
        await Activity.create(mockActivity);

        const response = await request(app).get("/api/Activity/all");

        expect(response.status).toBe(200);
        expect(response.body.Activitys).toBeInstanceOf(Array);
        expect(response.body.Activitys.length).toBe(1);
        expect(response.body.Activitys[0].name).toBe(mockActivity.name);
    });

    test("GET /Activity/Ename - should return an activity by name", async () => {
        await Activity.create(mockActivity);

        const response = await request(app)
            .get("/api/Activity/Ename")
            .query({ ActivityName: mockActivity.name });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe(mockActivity.name);
    });
});