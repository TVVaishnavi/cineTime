const flightService = require("../../service/travels/flight")
const Flight = require("../../model/travels/flight")

const createFlight = async(req, res)=>{
    try {
        const flightData = req.body
        const flightNumber = flightData.flightNumber
        const existingFlight = await Flight.findOne({flightNumber})

        if(existingFlight){
            res.json({message: "Flight already existed"})
        }else{
            const flight = await flightService.createFlight(flightData)
            res.status(201).json({flight, message: "flight created successfully"})
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const deleteFlight = async(req, res)=>{
    try {
        const _id = req.params['id']
        const existingFlight = await Flight.findOne({_id})
        if(!existingFlight){
            res.json({message: "flight not found"})
        }else{
            const deleteFlight = await Flight. findOneAndDelete({_id})
            res.status(201).json({Flight: deleteFlight, message: "Flight deleted successfully"})
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const updateFlight = async(req, res)=>{
    const flightData = req.body
    const flightNumber = flightData.flightNumber
    try {
        const flightExist = await Flight.findOne({flightNumber})
        if(!flightExist){
            res.json({message: "Flight not found"})
        }else{
            const newFlightData = flightService.updateFlight(flightData, flightExist)
            const flight = await Flight.findOneAndUpdate({flightNumber}, {$set: newFlightData})
            res.status(201).json({flight, message: "Flight updated"})
        }
    } catch (error) {
        res.json({message: error})
    }
}

const searchFlight = async (req, res) => {
    try {
        if (!req.body.source) {
            const error = new Error('Source is required for flight search');
            res.status(400).json({ message: error.message });
            throw error;
        }

        const { departure, source, date } = req.body;
        const flights = await Flight.find({
            departure: departure,
            source: { $regex: new RegExp(source, 'i') },
            date: date
        });

        return res.status(201).json(flights);
    } catch (error) {
        console.error('Flight search error:', error);
        if (!res.statusCode || res.statusCode === 200) {
            res.status(500).json({ 
                message: 'Error searching flights', 
                error: error.message 
            });
        }
        throw error;
    }
};

const searchFlightId = async(req, res)=>{
    try {
        const {flightNumber} = req.body
        const searchFlight = await Flight.find({flightNumber: flightNumber})
        if(searchFlight){
            res.status(201).json(searchFlight)
        }else{
            res.status(404).json({message: "Flight not found"})
        }
    } catch (error) {
        console.log(error)
    }
}

const getFlightDetails = async(req, res)=>{
    const data = await flightService.getFlightDetails()
    res.status(201).json(data)
}

module.exports = { createFlight, deleteFlight, updateFlight, getFlightDetails, searchFlight, searchFlightId }