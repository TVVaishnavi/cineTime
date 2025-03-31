const mongoose = require("../../config/database")
const {Schema, model, models} = require("mongoose")


const EventSchema = new Schema({
    imageURL: {type: String, required: true},
    name: {type: String, required: true},
    dateTime: {type: Date, required: true},
    place: {type: String, required: true},
    duration: {type: String, required: true},
    language: {type: String, required: true},
    price: {type: Number, required: true}, 
})

const Event = models.event || model("event", EventSchema);
module.exports = Event