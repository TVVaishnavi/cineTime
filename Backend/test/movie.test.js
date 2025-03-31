const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const Movie = require("../src/model/movies/movie");
const movieRoutes = require("../src/routes/movies/movie");
const movieService = require("../src/service/movies/movie");
const app = express();
require("dotenv").config()

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});



app.use(express.json());
app.use("/api", movieRoutes);

jest.mock("../src/model/movies/movie");

describe("Movie Service API", () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test("should create a movie", async () => {
        const mockMovie = { title: "Inception", genre: "Sci-Fi", director: "Christopher Nolan" };
        Movie.prototype.save.mockResolvedValue(mockMovie);

        const res = await request(app).post("/api/movies/create").send(mockMovie);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Movie created successfully");
    });

    test("should update a movie", async () => {
        const movieId = new mongoose.Types.ObjectId();
        const updatedData = { title: "Updated Movie" };
        Movie.findByIdAndUpdate.mockResolvedValue({ _id: movieId, ...updatedData });

        const res = await request(app).put(`/api/movies/${movieId}`).send(updatedData);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Movie updated successfully");
    });

    test("should delete a movie", async () => {
        const movieId = new mongoose.Types.ObjectId();
        Movie.findByIdAndDelete.mockResolvedValue(true);

        const res = await request(app).delete(`/api/movies/${movieId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Movie deleted successfully");
    });

    test("should fetch all movies", async () => {
        Movie.find.mockResolvedValue([{ title: "Inception" }, { title: "Interstellar" }]);
        
        const res = await request(app).get("/api/movies/get");
        expect(res.body.movies.length).toBe(2);
    });
});
