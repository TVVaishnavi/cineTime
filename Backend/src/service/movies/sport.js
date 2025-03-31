const Sport = require("../../model/movies/sports");

class SportService {
    constructor() {
        if (!SportService.instance) {
            SportService.instance = this;
        }
        return SportService.instance;
    }

    async createSport(sportData) {
        try {
            const sport = new Sport(sportData);
            await sport.save();
            return sport;
        } catch (error) {
            throw new Error("Error creating sport: " + error.message);
        }
    }

    async updateSport(sportId, updatedData) {
        try {
            const sport = await Sport.findByIdAndUpdate(sportId, updatedData, {
                new: true,
                runValidators: true,
            });
            if (!sport) throw new Error("Sport not found");
            return sport;
        } catch (error) {
            throw new Error("Error updating sport: " + error.message);
        }
    }

    async deleteSport(sportId) {
        try {
            const sport = await Sport.findByIdAndDelete(sportId);
            if (!sport) {
                throw new Error("Sport not found");
            }
            return sport;
        } catch (error) {
            throw new Error("Error deleting sport: " + error.message);
        }
    }
    

    async getAllSports() {
        try {
            return await Sport.find();
        } catch (error) {
            throw new Error("Error fetching sports: " + error.message);
        }
    }
    

    async getSportByName(SportName) {
        try {
            const sport = await Sport.findOne({ 
                name: { $regex: `^${SportName.replace(/[-]/g, "\\-").trim()}$`, $options: "i" }
            });
            console.log("Regex Query Result:", sport);
            
            return sport;
        } catch (error) {
            throw new Error("Error fetching sport: " + error.message);
        }
    }
    
}

const sportServiceInstance = new SportService();
Object.freeze(sportServiceInstance);
module.exports = sportServiceInstance;
