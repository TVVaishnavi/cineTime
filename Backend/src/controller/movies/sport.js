const { createSport, updateSport, deleteSport, getAllSports, getSportByName } = require("../../service/movies/sport");
const mongoose = require("mongoose");
const Sport = require("../../model/movies/sports");

const createSportController = async (req, res) => {
    try {
        const sportData = req.body;
        const sport = await createSport(sportData);
        res.status(201).json({ message: "Sport created successfully", sport });
    } catch (error) {
        res.status(500).json({ message: "Error creating sport", error: error.message });
    }
};

const updateSportController = async (req, res) => {
    try {
        const { SportId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(SportId)) {
            return res.status(400).json({ message: "Invalid SportId format" });
        }

        const updateData = { ...req.body };
        delete updateData._id;

        const updatedSport = await Sport.findByIdAndUpdate(SportId, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedSport) {
            return res.status(404).json({ message: "Sport not found" });
        }

        res.status(200).json({ message: "Sport updated successfully", sport: updatedSport });
    } catch (error) {
        res.status(500).json({ message: "Error updating sport", error: error.message });
    }
};

const deleteSportController = async (req, res) => {
    try {
        const sportId = req.params.sportId; 
        console.log("Deleting sport with ID:", sportId);

        const sport = await deleteSport(sportId);
        if (!sport) {
            return res.status(404).json({ message: "Sport not found" });
        }

        res.status(200).json({ message: "Sport deleted successfully" });
    } catch (error) {
        console.error("Error deleting sport:", error.message);
        res.status(500).json({ message: "Error deleting sport", error: error.message });
    }
};

const getAllSportController = async (req, res) => {
    try {
        const sports = await getAllSports();
        res.status(200).json({ sports });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSportByNameController = async (req, res) => {
    try {
        const SportName = decodeURIComponent(req.params.SportName).trim(); 
        console.log("Searching for sport:", SportName); 

        const sport = await getSportByName(SportName);
        console.log("Database response:", sport);
        if (!sport) {
            return res.status(404).json({ message: "Sport not found" });
        }
        res.status(200).json(sport);
    } catch (error) {
        console.error("Error fetching sport:", error.message);
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createSportController, updateSportController, deleteSportController, getAllSportController, getSportByNameController };
