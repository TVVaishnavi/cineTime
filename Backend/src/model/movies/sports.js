const mongoose = require("mongoose")
const {Schema, model, models} = require("mongoose")

const sportSchema = new Schema({
    imageURL: {type: String, required: true},
    match: {type: String, required: true},
    location: {type: String, required: true},
    dateTime: {type: Date, required: true},
    duration: {type: String, required: true},
    describtion: {type: String, required: true},
})

const Sport= models.sport|| model("sport", sportSchema);
module.exports = Sport 

