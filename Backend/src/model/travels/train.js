const mongoose = require("../../config/database");
const {Schema, model, models} = require("mongoose")


const TrainSchema = new Schema(
  {
    name: { type: String, required: true },
    trainNumber: { type: String, required: true, unique: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    stoppings: [{type: String, required: true}],
    availableSeats: { type: Number, required: true },
    bookedSeats: {type: Number, required: true},
    pricePerSeat: { type: Number, required: true },
  },
  { timestamps: true }
);

const TrainModel = models.train || model("train", TrainSchema)

module.exports = TrainModel;
