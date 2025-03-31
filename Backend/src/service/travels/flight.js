const Flight = require("../../model/travels/flight")

class flightService {
    constructor(){
        if(!flightService.instance){
            flightService.instance = this
        }
        return flightService.instance
    }
    async createFlight(flightData){
        const {name, flightNumber, source, destination, departureTime, arrivalTime, stoppings, availableSeats, bookedSeats, pricePerSeat} = flightData
        const newFlight = new Flight({
            name, flightNumber, source, destination, departureTime, arrivalTime, stoppings, availableSeats, bookedSeats, pricePerSeat
        })
        const saveFlight = await newFlight.save()
        return saveFlight
    }

    updateFlight (newFlightData, oldFlightData){
        return{
            name: newFlightData.name || oldFlightData.name, 
            flightNumber: newFlightData.flightNumber || oldFlightData.flightNumber,
            source: newFlightData.source || oldFlightData.source,
            destination: newFlightData. destination || oldFlightData.destination,
            arrivalTime: newFlightData. arrivalTime || oldFlightData.arrivalTime,
            stoppings: newFlightData.stoppings || oldFlightData.stoppings,
            availableSeats: newFlightData. availableSeats || oldFlightData. availableSeats,
            bookedSeats: newFlightData. bookedSeats || oldFlightData.bookedSeats,
            pricePerSeat: newFlightData.pricePerSeat || oldFlightData.pricePerSeat,
        }
    }
    async getFlightDetails(){
        return await Flight.find({})
    }
}

const flightServiceInstance = new flightService()
Object.freeze(flightServiceInstance)
module.exports = flightServiceInstance 