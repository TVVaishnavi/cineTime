const mongoose = require("mongoose");
const BaseTicketSchema = require("./baseTicket.model").schema;

const FlightTicketSchema = new mongoose.Schema({
  ...BaseTicketSchema.obj, 
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
});

module.exports = mongoose.model("FlightTicket", FlightTicketSchema);
