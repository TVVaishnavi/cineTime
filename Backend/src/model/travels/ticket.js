const mongoose = require("mongoose");

const BaseTicketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    travelType: { type: String, enum: ["Bus", "Train", "Flight"], required: true },
    travelId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    seatNumber: { type: [String], required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["Booked", "Cancelled"], default: "Booked" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BaseTicket", BaseTicketSchema);
