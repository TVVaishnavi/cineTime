const express = require("express");
const { createSportController, updateSportController, deleteSportController, getAllSportController, getSportByNameController } = require("../../controller/movies/sport");
const router = express.Router();

router.post("/sports/create", createSportController);
router.put("/sports/update/:SportId", updateSportController);
router.delete("/dsports/:sportId", deleteSportController);
router.get("/sports/all", getAllSportController);
router.get("/sports/:SportName", getSportByNameController);

module.exports = router;
