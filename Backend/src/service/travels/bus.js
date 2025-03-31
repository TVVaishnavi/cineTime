const buses = require("../../model/travels/bus");

class BusService {
    constructor() {
        if (!BusService.instance) {
            BusService.instance = this;
        }
        return BusService.instance;
    }

    async createBus(busData) {
        const {
            busName,
            busNumber,
            totalSeat,
            Bustype,
            availableSeat,
            bookedSeat,
            inAC,
            arrival,
            departure,
            stoppings,
            arriveTime,
            departureTime,
            date
        } = busData;

        const newBus = new buses({
            busName,
            busNumber,
            totalSeat,
            Bustype,
            availableSeat,
            bookedSeat,
            inAC,
            arrival,
            departure,
            stoppings,
            arriveTime,
            departureTime,
            date
        });

        const saveBus = await newBus.save();
        return saveBus;
    }

    updateBus(newBusData, oldBusData) {
        return {
            busName: newBusData.busName || oldBusData.busName,
            busNumber: newBusData.busNumber || oldBusData.busNumber,
            totalSeat: newBusData.totalSeat || oldBusData.totalSeat,
            availableSeat: newBusData.availableSeat || oldBusData.availableSeat,
            bookedSeat: newBusData.bookedSeat || oldBusData.bookedSeat,
            inAC: newBusData.inAC || oldBusData.inAC,
            arrival: newBusData.arrival || oldBusData.arrival,
            departure: newBusData.departure || oldBusData.departure,
            stoppings: newBusData.stoppings || oldBusData.stoppings,
            arriveTime: newBusData.arriveTime || oldBusData.arriveTime,
            departureTime: newBusData.departureTime || oldBusData.departureTime,
            date: newBusData.date || oldBusData.date
        };
    }

    async getBusDetails() {
        return await buses.find({});
    }
}

const busServiceInstance = new BusService();
Object.freeze(busServiceInstance); 
module.exports = busServiceInstance;
