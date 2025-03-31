const Train = require("../../model/travels/trainTicket");
const Ticket = require("../../model/travels/ticket");

const bookTicket = async (ticketDetails) => {
    const { trainNumber } = ticketDetails;
    const train = await Train.findOne({ trainNumber });

    if (!train) {
        return { status: 404, data: { message: "Train not found" } };
    }

    const newTicket = await Ticket.create({
        ...ticketDetails,
        seatNumbers: [], 
        transportType: "train"
    });

    return { status: 201, data: { ticket: newTicket, message: "Train ticket booked successfully" } };
};

const cancelTicket = async (ticketDetails) => {
    const { PNR } = ticketDetails;
    const ticket = await Ticket.findOneAndDelete({ PNR, transportType: "train" });

    if (!ticket) {
        return { status: 404, data: { message: "Ticket not found" } };
    }

    return { status: 200, data: { message: "Train ticket canceled successfully" } };
};

module.exports = { bookTicket, cancelTicket };
