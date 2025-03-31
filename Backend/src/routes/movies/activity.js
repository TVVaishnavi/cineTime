const express = require("express")
const {createActivityController, updateActivityController, deleteActivityController, getAllActivityController, getActivityByNameController} = require("../../controller/movies/activity")
const router = express.Router()
const authenticateToken = require("../../middleware/authentication")

router.post("/Activity/create", createActivityController) 
router.put("/Activity/:ActivityId",  updateActivityController)
router.delete("/Adelete/:ActivityId",  deleteActivityController)
router.get("/Activity/all", getAllActivityController)
router.get("/Activity/:Ename", getActivityByNameController)

module.exports = router 