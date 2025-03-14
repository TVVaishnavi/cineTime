const Movie = require("../model/movie");
const Ticket = require("../model/ticket");
const mongoose = require("mongoose");

const bookMovieTicket = async (user, movieTitle, theatreName, showTime, seatNumbers, totalPrice) => {
    try {
        console.log(movieTitle)
        const existedMovie = await Movie.findOne({ title: movieTitle })
        if (!existedMovie) {
            throw new Error("Movie not found");
        }
        const seat=[...existedMovie.bookedSeats,...seatNumbers]
        const updatedata={
            posterURL: existedMovie.posterURL,
            title: existedMovie.title,
            description: existedMovie.description,
            genre: existedMovie.genre,
            releaseDate: existedMovie.releaseDate,
            director: existedMovie.director,
            cast:existedMovie.cast,
            rating: existedMovie.rating,
            duration:existedMovie.duration,
            language:existedMovie.language,
            
            theatres: existedMovie.theatres,
          
            availableSeats: existedMovie.availableSeats, 
            bookedSeats:seat, 
            createdAt:existedMovie.createdAt
        }

        await Movie.findOneAndUpdate({_id:existedMovie._id},{$set:updatedata})

        const ticketData = {
            user,
            movieTitle,
            theatreName,
            showTime,
            seatNumbers,
            totalPrice
        };
       console.log(ticketData)
        const bookTicket = new Ticket(ticketData);
        bookTicket.save(); 
        console.log("bjhb")
        return { message: "Ticket booked successfully", data: bookTicket };
    } catch (error) {
        await session.abortTransaction(); 
        session.endSession();
        return { error: error.message };
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
