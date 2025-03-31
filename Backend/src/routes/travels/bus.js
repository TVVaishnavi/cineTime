const express = require("express")
const cors = require("cors")
const authMiddleWare = require("../../middleware/authentication")
const busControlLer = require("../../controller/travels/bus")

const router = express.Router()

router.use(cors())
      
router.route("/bus/create-bus")
   .post( busControlLer.createBus)
router.route("/bus/search-bus")
   .post(busControlLer.searchbusad)
router.route("/delete-bus/:id")
   .delete(busControlLer.deleteBus)
router.route("/update-bus")
   .put( busControlLer.updateBus)

router.route("view/bus-details")
  .get(busControlLer.getBusDetails)
router.route("/user/view/search-bus")
  .post(busControlLer.searchBus)


module.exports = router