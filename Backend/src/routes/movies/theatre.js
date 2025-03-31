const express = require("express");
const router = express.Router();
const {
  createTheatreController,
  getTheatresController,
  getTheatresByMovieController,
  getMoviesInTheatreController,
  updateTheatreController,
  deleteTheatreController,
  bookSeatThroughTheatreController, searchTheatresController
} = require("../../controller/movies/theatre");


router.post("/search", searchTheatresController);
router.post("/create", createTheatreController);

router.get("/all", getTheatresController);

router.get("/movies/:movieTitle", getTheatresByMovieController);

router.get("/:theatreName/movies", getMoviesInTheatreController);

router.put("/update/:id", updateTheatreController);

router.delete("/delete/:id", deleteTheatreController);

router.post("/book-seat", bookSeatThroughTheatreController);

router.get("/seat-details/:theatreId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.theatreId)) {
      return res.status(400).json({ error: "Invalid theatre ID format" });
    }

    const theatre = await Theatre.findById(req.params.theatreId)
      .select("availableSeats bookedSeats")
      .lean();

    if (!theatre) {
      return res.status(404).json({ error: "Theatre not found" });
    }

    res.json({
      availableSeats: theatre.availableSeats || {},
      bookedSeats: theatre.bookedSeats || []
    });

  } catch (error) {
    console.error("Error fetching seat details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  app.get('/theatres/:theatreId/seats', async (req, res) => {
    try {
      const theatre = await Theatre.findById(req.params.theatreId).populate('seats');
      res.json(theatre.seats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

});

module.exports = router;
