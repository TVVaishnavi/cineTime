const { updateMovie, deleteMovie, getMovieByName, getMovies, bookSeat } = require("../service/movie");
const Movie = require("../model/movie");

const createMovieController = async (req, res) => {
    try {
        const movieData = req.body;
        const movie = new Movie(movieData);
        await movie.save();
        console.log("Movie saved:", movie);
        res.status(201).json({ message: "Movie created successfully", movie });
    } catch (error) {
        console.error("Error creating movie:", error.message);
        res.status(500).json({ message: "Error creating movie", error: error.message });
    }
};

const updateMovieController = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const updateData = req.body;
        const updatedMovie = await updateMovie(movieId, updateData);
        res.status(200).json({ message: "Movie updated successfully", movie: updatedMovie });
    } catch (error) {
        console.error("Error updating movie:", error.message);
        res.status(500).json({ message: "Error updating movie", error: error.message });
    }
};

const deleteMovieController = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        await deleteMovie(movieId);
        res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
        console.error("Error deleting movie:", error.message);
        res.status(500).json({ message: "Error deleting movie", error: error.message });
    }
};

const searchMovies = async (req, res) => {
    try {
        const { title, genre, director, language } = req.body;
        const filter = {};
        if (title) filter.title = { $regex: title, $options: 'i' };
        if (genre) filter.genre = { $regex: genre, $options: 'i' };
        if (director) filter.director = { $regex: director, $options: 'i' };
        if (language) filter.language = { $regex: language, $options: 'i' };
        
        const movies = await getMovies(filter);
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        res.status(500).json({ message: "Error searching movies", error: error.message });
    }
};

const getMovieByNameController = async (req, res) => {
    try {
        const movieName = req.params.moviename;
        if (!movieName || movieName.includes(":")) {
            return res.status(400).json({ message: "Invalid movie name" });
        }
        const movie = await getMovieByName(movieName);
        res.status(200).json({ movie });
    } catch (error) {
        console.error("Error fetching movie by name:", error.message);
        res.status(500).json({ message: "Error fetching movie", error: error.message });
    }
};

const getMoviesController = async (req, res) => {
    try {
        const query = req.body;
        const movies = await getMovies(query);
        res.status(200).json({ movies });
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        res.status(500).json({ message: "Error fetching movies", error: error.message });
    }
};

const bookSeatController = async (req, res) => {
    try {
        const { movieName, theatreName, showTime, seatCategory, row, seatNumber } = req.body;
        if (!movieName || !theatreName || !showTime || !seatCategory || !row || !seatNumber) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const result = await bookSeat(movieName, theatreName, showTime, seatCategory, row, seatNumber);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error booking seat:", error.message);
        res.status(400).json({ message: "Error booking seat", error: error.message });
    }
};

module.exports = {
    createMovieController,
    updateMovieController,
    deleteMovieController,
    getMovieByNameController,
    getMoviesController,
    searchMovies,
    bookSeatController
};
