const request = require("supertest");
require("dotenv").config();
const app = require("../src/server");
const database = require("../src/patterns/singleton/database");

beforeAll(async () => {
  await database.getConnection(); 
  console.log("Database connected for testing...");
});

afterAll(async () => {
  await database.closeConnection();
});

describe("Sport Routes", () => {
    let sportId;

    it("should create a new sport", async () => {
        const res = await request(app).post("/sports/create").send({
            name: "Football",
            players: 11,
        });

        console.log("POST /sports/create Response:", res.body); 

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("name", "Football");
        sportId = res.body._id;
    });

    it("should get all sports", async () => {
        const res = await request(app).get("/sports/all");

        console.log("GET /sports/all Response:", res.body); 

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should get a sport by name", async () => {
        const res = await request(app).get(`/sports/Ename/Football`);

        console.log(`GET /sports/Ename/Football Response:`, res.body); 

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name", "Football");
    });

    it("should update a sport", async () => {
        const res = await request(app).put(`/sports/update/${sportId}`).send({
            name: "Updated Football",
            players: 12,
        });

        console.log(`PUT /sports/update/${sportId} Response:`, res.body); 

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name", "Updated Football");
    });

    it("should delete a sport", async () => {
        const res = await request(app).delete(`/sports/delete/${sportId}`);

        console.log(`DELETE /sports/delete/${sportId} Response:`, res.body); 

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Sport deleted successfully");
    });
});

