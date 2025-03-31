const mongoose = require("../../config/database");
const {Schema, model, models} = require("mongoose")

const theatreSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  movies: [{ type: String, required: true }],
  availableSeats: {
    premium: {
      rowA: [Number],
      rowB: [Number]
    },
    regular: {
      rowC: [Number],
      rowD: [Number],
      rowE: [Number]
    },
    recliner: {
      rowF: [Number]
    }
  },
  bookedSeats: [Number]
  
});

const Theatre = models.theatre || model("theatre", theatreSchema);

module.exports = Theatre;
