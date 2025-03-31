const express = require("express")
const { createMovieController, updateMovieController, deleteMovieController, getMovieByNameController, getMoviesController, searchMovies, bookSeatController } = require("../../controller/movies/movie")
const router = express.Router()
const Movie = require("../../model/movies/movie")
const authenticate = require("../../middleware/authentication")

router.post("/movies", searchMovies)
router.post("/movies/create", authenticate.authenticateToken, createMovieController)

router.put("/movies/:movieId", authenticate.authenticateToken, updateMovieController)

router.delete("/movies/:movieId", authenticate.authenticateToken, deleteMovieController)

router.get("/movies/name/:moviename", getMovieByNameController);

router.get("/movies/get", getMoviesController)

router.get("/showtimes/:date", async (req, res) => {
    try {
      const { date } = req.params;
  
      const movies = await Movie.find({
        "showtimes.date": date, 
      });
  
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Error fetching movies for selected date" });
    }
  });
router.post("/book-seat", bookSeatController)

module.exports = router
