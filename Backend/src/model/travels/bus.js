const mongoose = require("../../config/database")
const { Schema, model, models } = require("mongoose")

const busSchema = new Schema({
    busName: { type: String, required: true },
    busNumber: { type: String, required: true, unique: true },
    totalSeat: { type: Number, required: true },
    Bustype: { type: String, required: true },
    availableSeat: { type: Number, required: true }, 
    bookedSeat: [{ type: String }], 
    inAC: { type: Boolean, required: true },
    arrival: { type: String, required: true },
    departure: { type: String, required: true },
    stoppings: [{ type: String, required: true }],
    arriveTime: { type: String, required: true },
    departureTime: { type: String, required: true },
    date: { type: String, required: true },
}, { timestamps: true })


const BusModel = models.buses || model("buses", busSchema)

module.exports = BusModel
