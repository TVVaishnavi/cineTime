const Movie = require('../model/movie');
const mongoose = require("mongoose");

const createMovie = async (movieData) => {
    try {
        const show = new Movie(movieData);
        await show.save();
        return show;
    } catch (error) {
        throw new Error("Error creating movie: " + error.message);
    }
};

const updateMovie = async (movieId, updatedData) => {
    try {
        const movie = await Movie.findByIdAndUpdate(movieId, updatedData, {
            new: true,
            runValidators: true,
        });
        if (!movie) throw new Error("Movie not found");
        return movie;
    } catch (error) {
        throw new Error("Error updating movie: " + error.message);
    }
};

const deleteMovie = async (movieId) => {
    try {
        const movie = await Movie.findByIdAndDelete(movieId);
        if (!movie) throw new Error("Movie not found");
        return movie;
    } catch (error) {
        throw new Error("Error deleting movie: " + error.message);
    }
};

// ✅ Get movie by name & return available seats for each theatre/showtime
const getMovieByName = async (movieName) => {
    try {
        const movie = await Movie.findOne({
            title: { $regex: new RegExp("^" + movieName + "$", "i") }
        });

        if (!movie) throw new Error("Movie not found");

        // Ensure each theatre/showtime has availableSeats initialized
        movie.theatres.forEach(theatre => {
            theatre.showTimes.forEach(show => {
                show.availableSeats = show.availableSeats || { premium: {}, regular: {}, recliner: {} };
                show.bookedSeats = show.bookedSeats || [];
            });
        });

        return [movie];  // Ensure response format is an array
    } catch (error) {
        console.error("Error fetching movie:", error.message);
        throw new Error("Error fetching movie");
    }
};

// ✅ Get all movies based on query
const getMovies = async (query) => {
    try {
        const movies = await Movie.find(query);
        if (movies.length === 0) {
            throw new Error("No movies found with the given criteria");
        }
        return movies;
    } catch (error) {
        throw new Error("Error fetching movies: " + error.message);
    }
};

// ✅ Book a seat for a specific theatre & showtime
const bookSeat = async (movieName, theatreName, showTime, seatCategory, row, seatNumber) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const movie = await Movie.findOne({
            title: { $regex: new RegExp("^" + movieName + "$", "i") },
            "theatres.name": theatreName,
            "theatres.showTimes.time": showTime
        }).session(session);

        if (!movie) throw new Error("Movie or Showtime not found");

        // Locate the theatre & showtime inside the nested structure
        const theatre = movie.theatres.find(t => t.name === theatreName);
        const show = theatre.showTimes.find(s => s.time === showTime);

        if (!show.availableSeats?.[seatCategory]?.[row]) {
            throw new Error(`Row "${row}" in category "${seatCategory}" not found`);
        }

        const seatIndex = show.availableSeats[seatCategory][row].indexOf(String(seatNumber));
        if (seatIndex === -1) {
            throw new Error(`Seat ${seatNumber} is already booked or does not exist`);
        }

        // Remove from availableSeats and add to bookedSeats
        show.availableSeats[seatCategory][row].splice(seatIndex, 1);
        show.bookedSeats.push(`${row}${seatNumber}`);

        await movie.save({ session });
        await session.commitTransaction();
        session.endSession();

        return { message: "Seat booked successfully", movie };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error.message);
    }
};

module.exports = { createMovie, updateMovie, deleteMovie, getMovieByName, getMovies, bookSeat };
