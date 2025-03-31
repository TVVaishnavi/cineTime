const { createEvent, updateEvent, deleteEvent, getAllEvents, getEventByName } = require("../../service/movies/event");
const Event = require("../../model/movies/events");
const mongoose = require("mongoose");

const createEventController = async (req, res) => {
    try {
        const eventData = req.body;
        const createdEvent = await createEvent(eventData);
        res.status(201).json({ message: "Event created successfully", event: createdEvent });
    } catch (error) {
        res.status(500).json({ message: "Error creating event", error: error.message });
    }
};

const updateEventController = async (req, res) => {
    try {
        const { eventId } = req.params;
        console.log("Received eventId:", eventId);

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            console.log("Invalid ID detected:", eventId);
            return res.status(400).json({ message: "Invalid eventId format" });
        }

        const updateData = { ...req.body };
        delete updateData._id;

        const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: "Error updating event", error: error.message });
    }
};

const deleteEventController = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        await deleteEvent(eventId);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error: error.message });
    }
};

const getAllEventController = async (req, res) => {
    try {
        const events = await getAllEvents();
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEventByNameController = async (req, res) => {
    try {
        const  eventName  = req.params.Ename;
        const event = await getEventByName(eventName);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEventController,
    updateEventController,
    deleteEventController,
    getAllEventController,
    getEventByNameController,
};
