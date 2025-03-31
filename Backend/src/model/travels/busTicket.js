const mongoose = require("mongoose");
const BaseTicketSchema = require("./baseTicket.model").schema;

const BusTicketSchema = new mongoose.Schema({
  ...BaseTicketSchema.obj, 
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
});

module.exports = mongoose.model("BusTicket", BusTicketSchema);
