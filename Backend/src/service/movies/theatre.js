const Theatre = require("../../model/movies/theatre");
const Movie = require("../../model/movies/movie");

class TheatreService {
    constructor() {
        if (!TheatreService.instance) {
            TheatreService.instance = this;
        }
        return TheatreService.instance;
    }

    async searchTheatres({ theatreName, location, movie }) {
        try {
            let query = {};
            if (theatreName) query.theatreName = new RegExp(theatreName, "i");
            if (location) query.location = new RegExp(location, "i");
            if (movie) query.movies = { $in: [movie] };

            return await Theatre.find(query);
        } catch (error) {
            throw new Error("Error searching theatres: " + error.message);
        }
    }

    async createTheatre(theatreData) {
        try {
            const theatre = new Theatre(theatreData);
            await theatre.save();
            return theatre;
        } catch (error) {
            throw new Error("Error creating theatre: " + error.message);
        }
    }

    async getTheatres() {
        try {
            return await Theatre.find({});
        } catch (error) {
            throw new Error("Error fetching theatres: " + error.message);
        }
    }

    async getTheatresByMovieName(movieName) {
        try {
            const movie = await Movie.findOne({ title: movieName });
            if (!movie) throw new Error("Movie not found");

            const theatres = await Theatre.find({ movies: movieName });
            if (theatres.length === 0) throw new Error("No theatres found for this movie");

            return theatres;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMoviesInTheatre(theatreName) {
        try {
            const theatre = await Theatre.findOne({ name: theatreName });
            if (!theatre) throw new Error("Theatre not found");

            return theatre.movies;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateTheatre(theatreId, updatedData) {
        try {
            const theatre = await Theatre.findByIdAndUpdate(theatreId, updatedData, {
                new: true,
                runValidators: true,
            });
            if (!theatre) throw new Error("Theatre not found");
            return theatre;
        } catch (error) {
            throw new Error("Error updating theatre: " + error.message);
        }
    }

    async deleteTheatre(theatreId) {
        try {
            const theatre = await Theatre.findByIdAndDelete(theatreId);
            if (!theatre) throw new Error("Theatre not found");
            return theatre;
        } catch (error) {
            throw new Error("Error deleting theatre: " + error.message);
        }
    }

    async bookSeatThroughTheatre(theatreName, movieName, seatNumber) {
        try {
            const movie = await Movie.findOne({ title: movieName, theatre: theatreName });

            if (!movie) throw new Error("Movie not found in this theatre");

            if (!movie.availableSeat.includes(seatNumber)) {
                throw new Error("Seat already booked or not available");
            }

            movie.availableSeat = movie.availableSeat.filter(seat => seat !== seatNumber);
            movie.bookedSeat.push(seatNumber);

            await movie.save();

            return { message: "Seat booked successfully", bookedSeat: seatNumber };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getTheatreWithSeatDetails(theatreId) {
        try {
            const theatre = await Theatre.findById({ _id: theatreId }).lean();
            if (!theatre) throw new Error("Theatre not found");

            const movies = await Movie.find({ theatres: theatreId }).lean();

            const movieData = movies.map(movie => ({
                movieId: movie._id,
                movieName: movie.title,
                availableSeats: movie.availableSeats,
                bookedSeats: movie.bookedSeats,
            }));

            return { ...theatre, movies: movieData };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const theatreServiceInstance = new TheatreService();
Object.freeze(theatreServiceInstance);
module.exports = theatreServiceInstance;
