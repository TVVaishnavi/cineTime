const Activity = require("../../model/movies/activity");

class ActivityService {
    constructor() {
        if (!ActivityService.instance) {
            ActivityService.instance = this;
        }
        return ActivityService.instance;
    }

    async createActivity(activityData) {
        try {
            const show = new Activity(activityData);
            await show.save();
            return show;
        } catch (error) {
            throw new Error("Error creating Activity: " + error.message);
        }
    }

    async updateActivity(activityId, updatedData) {
        try {
            const activity = await Activity.findByIdAndUpdate(activityId, updatedData, {
                new: true, 
                runValidators: true,
            });
            if (!activity) throw new Error("Activity not found");
            return activity;
        } catch (error) {
            throw new Error("Error updating Activity: " + error.message);
        }
    }

    async deleteActivity(activityId) {
        try {
            const activity = await Activity.findByIdAndDelete(activityId);
            if (!activity) throw new Error("Activity not found");
            return activity;
        } catch (error) {
            throw new Error("Error deleting Activity: " + error.message);
        }
    }

    async getAllActivities() {
        try {
            return await Activity.find();
        } catch (error) {
            throw new Error("Error fetching Activities: " + error.message);
        }
    }

    async getActivityByName(activityName) {
        try {
            return await Activity.findOne({ name: new RegExp(`^${activityName.trim()}$`, "i") });
        } catch (error) {
            throw new Error("Error fetching Activity: " + error.message);
        }
    }
    
}

const activityServiceInstance = new ActivityService();
Object.freeze(activityServiceInstance); 
module.exports = activityServiceInstance;
