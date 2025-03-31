const Flight = require("../../model/travels/flightTicket")
const Ticket = require("../../model/travels/ticket")

const bookTicket = async (ticketDetails) => {
    const { flightNumber } = ticketDetails
    const flight = await Flight.findOne({ flightNumber })

    if (!flight) {
        return { status: 404, data: { message: "Flight not found" } }
    }

    const newTicket = await Ticket.create({
        ...ticketDetails,
        seatNumbers: [], 
        transportType: "flight"
    })

    return { status: 201, data: { ticket: newTicket, message: "Flight ticket booked successfully" } }
}

const cancelTicket = async (ticketDetails) => {
    const { PNR } = ticketDetails
    const ticket = await Ticket.findOneAndDelete({ PNR, transportType: "flight" })

    if (!ticket) {
        return { status: 404, data: { message: "Ticket not found" } }
    }

    return { status: 200, data: { message: "Flight ticket canceled successfully" } }
}

module.exports = { bookTicket, cancelTicket }
