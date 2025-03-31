const express = require("express")
const {createEventController, updateEventController, deleteEventController, getAllEventController, getEventByNameController} = require("../../controller/movies/event")
const router = express.Router()
const authenticateToken = require("../../middleware/authentication")

router.post("/event/create", createEventController) 
router.put("/event/:eventId",  updateEventController)
router.delete("/event/:eventId",  deleteEventController)
router.get("/event/all", getAllEventController)
router.get("/event/:Ename", getEventByNameController)

module.exports = router