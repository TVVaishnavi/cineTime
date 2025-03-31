const Bus = require("../../model/travels/busTicket");
const Ticket = require("../../model/travels/ticket");

const bookTicket = async (ticketDetails) => {
    const { busNumber, seatNumbers } = ticketDetails;
    const bus = await Bus.findOne({ busNumber });

    if (!bus) {
        return { status: 404, data: { message: "Bus not found" } };
    }

    let availableSeats = bus.availableSeat.upper?.first.length +
                         bus.availableSeat.upper?.second.length +
                         bus.availableSeat.lower?.first.length +
                         bus.availableSeat.lower?.second.length;

    if (availableSeats >= seatNumbers.length) {
        const newTicket = await Ticket.create({ ...ticketDetails, transportType: "bus" });
        return { status: 201, data: { ticket: newTicket, message: "Bus ticket booked successfully" } };
    } else {
        return { status: 400, data: { message: "Seats are full" } };
    }
};

const cancelTicket = async (ticketDetails) => {
    const { PNR } = ticketDetails;
    const ticket = await Ticket.findOneAndDelete({ PNR, transportType: "bus" });

    if (!ticket) {
        return { status: 404, data: { message: "Ticket not found" } };
    }

    return { status: 200, data: { message: "Bus ticket canceled successfully" } };
};

module.exports = { bookTicket, cancelTicket };
