const Movie = require("../../model/movies/movie");
const Ticket = require("../../model/movies/ticket");
const mongoose = require("mongoose");

class TicketService {
    constructor() {
        if (!TicketService.instance) {
            TicketService.instance = this;
        }
        return TicketService.instance;
    }

    async bookMovieTicket(req, res) {
        const { user, movieTitle, theatreName, showTime, seatNumbers, totalPrice, status } = req.body;
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            console.log(movieTitle);
            const existedMovie = await Movie.findOne({ title: movieTitle }).session(session);

            if (!existedMovie) {
                throw new Error("Movie not found");
            }

            const updatedSeats = existedMovie.bookedSeats
                ? [...existedMovie.bookedSeats, ...seatNumbers]
                : seatNumbers;

            await Movie.findByIdAndUpdate(
                existedMovie._id,
                { $set: { bookedSeats: updatedSeats } },
                { session }
            );

            const ticketData = { user, movieTitle, theatreName, showTime, seatNumbers, totalPrice };

            console.log(ticketData);

            const bookTicket = new Ticket(ticketData);
            await bookTicket.save({ session });

            await session.commitTransaction();
            session.endSession();

            return res.json({ message: "Ticket booked successfully", data: bookTicket });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: error.message });
        }
    }

    async cancelTicket(seatId, userId) {
        const ticket = await Ticket.findOne({ seatId });
        if (!ticket) throw new Error('Ticket not found or not booked');
    
        ticket.status = 'Cancelled';
        await ticket.cancel(); 
        
        return ticket;
    }
    
}

const ticketServiceInstance = new TicketService();
Object.freeze(ticketServiceInstance);
module.exports = ticketServiceInstance;
