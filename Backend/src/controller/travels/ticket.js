const { getTicketService } = require("../../patterns/factory/ticketfactory");
require('dotenv').config();
const ticketService = getTicketService(transportType);


const bookTicket = async (req, res) => {
    try {
        const { transportType, ...ticketDetails } = req.body;
        const ticketService = getTicketService(transportType);

        const ticket = await ticketService.bookTicket(ticketDetails);
        res.status(201).json({ ticket, message: "Ticket successfully booked" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

const cancelTicket = async (req, res) => {
    try {
        const { transportType, PNR } = req.body;
        const ticketService = getTicketService(transportType);

        const ticket = await ticketService.cancelTicket(PNR);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json({ ticket, message: "Ticket successfully canceled" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

const getTickets = async (req, res) => {
    try {
        const { transportType } = req.query; 
        const ticketService = getTicketService(transportType);

        const tickets = await ticketService.getAllTickets();
        res.status(200).json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

module.exports = { bookTicket, cancelTicket, getTickets };
