const mongoose = require("../../config/database");
const {Schema, model, models} = require("mongoose")

const TicketSchema = new Schema(
  {
    user: { type: String, required: true },
    movieTitle: { type: String, required: true, trim: true },
    theatreName: { type: String, required: true, trim: true },
    showTime: { type: String, required: true },
    seatNumbers: { type: [String], required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    bookingDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Ticket = models.ticket || model("ticket", TicketSchema);
module.exports = Ticket

