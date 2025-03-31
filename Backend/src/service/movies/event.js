const Event = require("../../model/movies/events");

class EventService {
    constructor() {
        if (!EventService.instance) {
            EventService.instance = this;
        }
        return EventService.instance;
    }

    async createEvent(eventData) {
        try {
            const event = new Event(eventData);
            await event.save();
            return event;
        } catch (error) {
            throw new Error("Error creating Event: " + error.message);
        }
    }

    async updateEvent(eventId, updatedData) {
        try {
            const event = await Event.findByIdAndUpdate(eventId, updatedData, {
                new: true,
                runValidators: true,
            });
            if (!event) throw new Error("Event not found");
            return event;
        } catch (error) {
            throw new Error("Error updating Event: " + error.message);
        }
    }

    async deleteEvent(eventId) {
        try {
            const event = await Event.findByIdAndDelete(eventId);
            if (!event) throw new Error("Event not found");
            return event;
        } catch (error) {
            throw new Error("Error deleting Event: " + error.message);
        }
    }

    async getAllEvents() {
        try {
            return await Event.find();
        } catch (error) {
            throw new Error("Error fetching Events: " + error.message);
        }
    }

    async getEventByName(eventName) {
        try {
            return await Event.findOne({ name: new RegExp(`^${eventName.trim()}$`, "i") }); // Trim and case-insensitive
        } catch (error) {
            throw new Error("Error fetching Event: " + error.message);
        }
    }
    
    
}

const eventServiceInstance = new EventService();
Object.freeze(eventServiceInstance);
module.exports = eventServiceInstance;
