const mongoose = require('mongoose');
const Movie = require('../../src/model/movies/movie');

const bookSeat = async (movieName, seatCategory, row, seatNumber, userId, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        const session = await mongoose.startSession(); 
        session.startTransaction();

        try {
            const movie = await Movie.findOne({ title: { $regex: new RegExp("^" + movieName + "$", "i") } }).session(session);
            if (!movie) {
                throw new Error("Movie not found");
            }

            const seatKey = `availableSeats.${seatCategory}.${row}`;
            const bookedSeat = `${row}${seatNumber}`;

            if (!movie.availableSeats[seatCategory] || !movie.availableSeats[seatCategory][row]) {
                throw new Error(`Row "${row}" in category "${seatCategory}" not found`);
            }

            const seatIndex = movie.availableSeats[seatCategory][row].indexOf(seatNumber);
            if (seatIndex === -1) {
                throw new Error("Seat already booked or does not exist");
            }

            movie.availableSeats[seatCategory][row].splice(seatIndex, 1);
            movie.bookedSeats.push(bookedSeat);

            await movie.save({ session });
            await session.commitTransaction();
            session.endSession();

            return { message: "Seat booked successfully", bookedSeat };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            if (attempt < retries) {
                console.warn(`Retrying seat booking... Attempt ${attempt + 1}`);
                continue; 
            }

            throw new Error(error.message);
        }
    }
};

module.exports = { bookSeat };
