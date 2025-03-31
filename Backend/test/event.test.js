const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const eventService = require("../src/service/movies/event");
const eventRoute = require("../src/routes/movies/event");
const database = require("../src/patterns/singleton/database");

beforeAll(async () => {
  await database.getConnection();
});

afterAll(async () => {
  await database.closeConnection();
});



const app = express();
app.use(express.json());
app.use("/api", eventRoute);

jest.mock("../src/service/movies/event");

describe("Event Controller Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(async () => {
        console.log("Test Setup: Connecting to MongoDB...");
        await database.connect(); 
        console.log("Connected to MongoDB");
    });

    afterAll(async () => {
        console.log("Test Teardown: Closing MongoDB Connection...");
        await database.disconnect(); 
        await mongoose.connection.close();
    });

    test("POST /event/create - should create an event", async () => {
        const mockEvent = { name: "BTS Concert", dateTime: "2025-04-10T18:00:00Z", price: 10000 };
        eventService.createEvent.mockResolvedValue(mockEvent);

        const response = await request(app).post("/api/event/create").send(mockEvent);

        console.log("Response Body:", response.body);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Event created successfully");
        expect(response.body.event).toEqual(mockEvent);
    });

    test("GET /event/all - should return all events", async () => {
        const mockEvents = [
            { name: "BTS Concert", dateTime: "2025-04-10T18:00:00Z", price: 10000 },
            { name: "Coldplay Live", dateTime: "2025-05-15T20:00:00Z", price: 5000 }
        ];

        eventService.getAllEvents.mockResolvedValue(mockEvents);
        console.log("Mocked getAllEvents:", mockEvents);

        const response = await request(app).get("/api/event/all");
        console.log("Response Body:", response.body);

        expect(response.status).toBe(200);
        expect(response.body.events).toEqual(mockEvents);
    });

    test("GET /event/:name - should return a specific event", async () => {
        const eventName = "BTS Concert";
        const mockEvent = { name: eventName, dateTime: "2025-04-10T18:00:00Z", price: 10000 };

        eventService.getEventByName.mockResolvedValue(mockEvent);
        console.log("Mocked getEventByName:", mockEvent);

        const response = await request(app).get(`/api/event/${eventName}`);
        console.log("Response Body:", response.body);

        expect(response.status).toBe(200);
        expect(response.body.event).toEqual(mockEvent);
    });

    test("PUT /event/update/:name - should update an event", async () => {
        const eventName = "BTS Concert";
        const updatedEvent = { name: eventName, dateTime: "2025-04-11T19:00:00Z", price: 600 };

        eventService.updateEvent.mockResolvedValue({ message: "Event updated successfully", event: updatedEvent });
        console.log("Mocked updateEvent:", updatedEvent);

        const response = await request(app).put(`/api/event/update/${eventName}`).send(updatedEvent);
        console.log("Response Body:", response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Event updated successfully");
        expect(response.body.event).toEqual(updatedEvent);
    });

    test("DELETE /event/delete/:name - should delete an event", async () => {
        const eventName = "BTS Concert";
        eventService.deleteEvent.mockResolvedValue({ message: "Event deleted successfully" });
        console.log("Mocked deleteEvent");

        const response = await request(app).delete(`/api/event/delete/${eventName}`);
        console.log("Response Body:", response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Event deleted successfully");
    });

    test("POST /event/book/:name - should book an event ticket", async () => {
        const eventName = "BTS Concert";
        const bookingInfo = { userId: "user123", seats: 2 };

        eventService.bookEvent.mockResolvedValue({ message: "Tickets booked successfully" });
        console.log("Mocked bookEvent");

        const response = await request(app).post(`/api/event/book/${eventName}`).send(bookingInfo);
        console.log("Response Body:", response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Tickets booked successfully");
    });
});
