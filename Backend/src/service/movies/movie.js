const Movie = require('../../model/movies/movie');
const mongoose = require("mongoose");

class MovieService {
    constructor() {
        if (!MovieService.instance) {
            MovieService.instance = this;
        }
        return MovieService.instance;
    }

    async createMovie(movieData) {
        try {
            const movie = new Movie(movieData);
            await movie.save();
            return movie;
        } catch (error) {
            throw new Error("Error creating movie: " + error.message);
        }
    }

    async updateMovie(movieId, updatedData) {
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
    }

    async deleteMovie(movieId) {
        try {
            const movie = await Movie.findByIdAndDelete(movieId);
            if (!movie) throw new Error("Movie not found");
            return movie;
        } catch (error) {
            throw new Error("Error deleting movie: " + error.message);
        }
    }

    async getMovieByName(movieName) {
        try {
            const movie = await Movie.findOne({
                title: { $regex: new RegExp("^" + movieName + "$", "i") }
            });

            if (!movie) throw new Error("Movie not found");

            movie.theatres.forEach(theatre => {
                theatre.showTimes.forEach(show => {
                    show.availableSeats = show.availableSeats || { premium: {}, regular: {}, recliner: {} };
                    show.bookedSeats = show.bookedSeats || [];
                });
            });

            return [movie];
        } catch (error) {
            throw new Error("Error fetching movie: " + error.message);
        }
    }

    async getMovies(query) {
        try {
            const movies = await Movie.find(query);
            if (movies.length === 0) throw new Error("No movies found with the given criteria");
            return movies;
        } catch (error) {
            throw new Error("Error fetching movies: " + error.message);
        }
    }

    async bookSeat(movieName, theatreName, showTime, seatCategory, row, seatNumber) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const movie = await Movie.findOne({
                title: { $regex: new RegExp("^" + movieName + "$", "i") },
                "theatres.name": theatreName,
                "theatres.showTimes.time": showTime
            }).session(session);

            if (!movie) throw new Error("Movie or Showtime not found");

            const theatre = movie.theatres.find(t => t.name === theatreName);
            const show = theatre.showTimes.find(s => s.time === showTime);

            if (!show.availableSeats?.[seatCategory]?.[row]) {
                throw new Error(`Row "${row}" in category "${seatCategory}" not found`);
            }

            const seatIndex = show.availableSeats[seatCategory][row].indexOf(String(seatNumber));
            if (seatIndex === -1) throw new Error(`Seat ${seatNumber} is already booked or does not exist`);

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
    }
}

const movieServiceInstance = new MovieService();
Object.freeze(movieServiceInstance);
module.exports = movieServiceInstance;
