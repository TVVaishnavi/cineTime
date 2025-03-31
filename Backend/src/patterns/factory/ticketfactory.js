const BusTicket = require("../../model/travels/busTicket");
const TrainTicket = require("../../model/travels/trainTicket");
const FlightTicket = require("../../model/travels/flightTicket");

class TicketFactory {
  static createTicket(type, ticketData) {
    switch (type) {
      case "Bus":
        return new BusTicket(ticketData);
      case "Train":
        return new TrainTicket(ticketData);
      case "Flight":
        return new FlightTicket(ticketData);
      default:
        throw new Error("Invalid ticket type");
    }
  }
}

module.exports = TicketFactory;
