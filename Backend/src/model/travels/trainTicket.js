const mongoose = require("mongoose");
const BaseTicketSchema = require("./baseTicket.model").schema;

const TrainTicketSchema = new mongoose.Schema({
  ...BaseTicketSchema.obj, 
  trainId: { type: mongoose.Schema.Types.ObjectId, ref: "Train", required: true },
});

module.exports = mongoose.model("TrainTicket", TrainTicketSchema);
