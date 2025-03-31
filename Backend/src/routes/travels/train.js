const express = require("express")
const cors = require("cors")
const authMiddleWare = require("../../middleware/authentication")
const trainController = require("../../controller/travels/train")


const router = express.Router()

router.use(cors())
      
router.route("/train/create-train")
   .post(authMiddleWare.authenticateToken, trainController.createTrain)
router.route("/train/search-train")
   .post(authMiddleWare.authenticateToken, trainController.searchTrainId)
router.route("/delete-train/:id")
   .delete( authMiddleWare.authenticateToken,trainController.deleteTrain)
router.route("/update-train")
   .put( authMiddleWare.authenticateToken,trainController.updateTrain)

router.route("/view/train-details")
  .get(authMiddleWare.authenticateToken,trainController.getTrainDetails)
router.route("/user/view/search-train")
  .post(trainController.searchTrain)


module.exports = router 