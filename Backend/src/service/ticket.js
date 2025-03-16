const Movie = require("../model/movie");
const Ticket = require("../model/ticket");
const mongoose = require("mongoose");

const bookMovieTicket = async (req, res) => {
    const { user, movieTitle, theatreName, showTime, seatNumbers, totalPrice } = req.body;
    const session = await Movie.startSession();
    session.startTransaction();

    try {
        console.log(movieTitle);
        const existedMovie = await Movie.findOne({ title: movieTitle }).session(session);

        if (!existedMovie) {
            throw new Error("Movie not found");
        }

        const updatedSeats = existedMovie.bookedSeats ? [...existedMovie.bookedSeats, ...seatNumbers] : seatNumbers;

        const updateData = {
            ...existedMovie.toObject(),
            bookedSeats: updatedSeats,
        };

        await Movie.findOneAndUpdate({ _id: existedMovie._id }, { $set: updateData }, { session });

        const ticketData = {
            user,
            movieTitle,
            theatreName,
            showTime,
            seatNumbers,
            totalPrice,
        };

        console.log(ticketData);

        const bookTicket = new Ticket(ticketData);
        await bookTicket.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.json({ message: "Ticket booked successfully", data: bookTicket });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({ error: error.message }); // Ensure only one response is sent
    }
};


const cancelMovieTicket = async (id) => {
    try {
        const findTicket = await Ticket.findOne({ _id: id });

        if (!findTicket) {
            throw new Error("Ticket Not Found");
        }

        await Movie.findOneAndUpdate(
            { title: findTicket.movieTitle },
            {
                $pull: { bookedSeat: { $in: findTicket.seatNumbers } }, 
                $push: { availableSeat: { $each: findTicket.seatNumbers } } 
            },
            { new: true }
        );

        await Ticket.deleteOne({ _id: id });

        return { message: "Ticket Canceled Successfully", data: findTicket };
    } catch (error) {
        return { error: error.message };
    }
};
module.exports = { bookMovieTicket, cancelMovieTicket };
