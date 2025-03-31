const mongoose = require("mongoose");
const Activity = require("../../model/movies/activity");

const createActivityController = async (req, res) => {
    try {
        const activityData = req.body;
        const activity = await Activity.create(activityData);
        res.status(201).json({
            message: "Activity created successfully", 
            Activity: activity
        });
    } catch (error) {
        console.error("Create Activity Error:", error);
        res.status(500).json({
            message: "Error creating Activity", 
            error: error.message
        });
    }
};

const getAllActivityController = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.status(200).json({ Activitys: activities });
    } catch (error) {
        console.error("Get All Activities Error:", error);
        res.status(500).json({ 
            message: "Error fetching activities", 
            error: error.message 
        });
    }
};

const getActivityByNameController = async (req, res) => {
    try {
        const activityName = decodeURIComponent(req.params.Ename); 
        console.log("Searching for activity:", activityName);

        const activity = await Activity.findOne({ name: new RegExp(`^${activityName.trim()}$`, "i") }); 
        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }
        
        res.status(200).json(activity);
    } catch (error) {
        console.error("Get Activity by Name Error:", error);
        res.status(500).json({ 
            message: "Error fetching activity", 
            error: error.message 
        });
    }
};


const updateActivityController = async (req, res) => {
    try {
        const { ActivityId } = req.params;
        const updatedData = req.body;

        console.log("Incoming Update Request:", ActivityId, updatedData);

        if (!mongoose.Types.ObjectId.isValid(ActivityId)) {
            console.log("Invalid Activity ID");
            return res.status(400).json({ message: "Invalid Activity ID" });
        }

        const updatedActivity = await Activity.findByIdAndUpdate(
            ActivityId, 
            updatedData, 
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            console.log("Activity Not Found");
            return res.status(404).json({ message: "Activity not found" });
        }

        console.log("Updated Activity:", updatedActivity);

        res.status(200).json({ message: "Activity updated successfully", activity: updatedActivity });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



const deleteActivityController = async (req, res) => {
    try {
        const { ActivityId } = req.params;

        console.log("Deleting Activity ID:", ActivityId);

        const deletedActivity = await Activity.findByIdAndDelete(ActivityId);

        if (!deletedActivity) {
            return res.status(404).json({ message: "Activity not found" });
        }

        res.status(200).json({ message: "Activity deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


module.exports = {
    createActivityController,
    getAllActivityController,
    getActivityByNameController,
    updateActivityController,
    deleteActivityController
};