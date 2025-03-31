const mongoose = require("../../config/database")
const {Schema, model, models} = require("mongoose")

const activitySchema = new Schema({
    imageURL: {type: String, required: true},
    name:{type: String, required: true},
    timing: {type: Date, required: true},
    location: {type: String, required: true},
    duration: {type: Number, required: true},
    description: {type: String, required: true},
    price: {type: String, required: true}
})

const Activity = models.activity || model("activity", activitySchema);
module.exports = Activity 