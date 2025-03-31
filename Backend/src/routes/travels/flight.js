const express = require("express")
const cors = require("cors")
const authMiddleWare = require("../../middleware/authentication")
const flightControlLer = require("../../controller/travels/flight")

const router = express.Router()

router.use(cors())
      
router.route("/flight/create-flight")
   .post(flightControlLer.createFlight)
router.route("/flight/search-flight")
   .post(authMiddleWare.authenticateToken, flightControlLer.searchFlightId)
router.route("/delete-flight/:id")
   .delete( authMiddleWare.authenticateToken,flightControlLer.deleteFlight)
router.route("/update-flight")
   .put( authMiddleWare.authenticateToken,flightControlLer.updateFlight)

router.route("view/flight-details")
  .get(authMiddleWare.authenticateToken,flightControlLer.getFlightDetails)
router.route("/user/view/search-flight")
  .post(flightControlLer.searchFlight)

module.exports = router  