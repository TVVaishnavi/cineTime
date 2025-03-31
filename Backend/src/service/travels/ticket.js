const TicketFactory = require("../../patterns/factory/ticketfactory")

class TicketService {
    static async bookTicket(travelType, ticketData){
        try {
            const ticket = TicketFactory.createTicket(travelType, ticketData)
            return await ticket.save()
        } catch (error) {
            throw new Error("Error booking ticket:" +error.message)
        }
    }
    static async getTicketByUser(userId) {
        try {
            const tickets = await TicketFactory.createTicket("Bus", {}).constructor.find({ userId })
            return tickets
        } catch (error) {
            throw new Error("Error fetching tickets: " + error.message)
        }
    }
    static async cancelTicket(ticketId, travelType){
        try {
            const ticketModel = TicketFactory.createTicket(travelType, {}).constructor
            return await ticketModel.findByIdAndUpdate(ticketId) 
        } catch (error) {
            throw new Error("Error cancelling ticket" + error.message)
        }
    }
}
module.exports = TicketService