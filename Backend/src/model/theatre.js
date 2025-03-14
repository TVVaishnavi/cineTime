const mongoose = require("../config/database");
const Schema = mongoose.Schema;

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

const Theatre = mongoose.model("Theatre", theatreSchema);

module.exports = Theatre;
