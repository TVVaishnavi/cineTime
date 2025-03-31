const express = require("express");
const TicketController = require("../../controller/travels/ticket");
const authentication = require("../../middleware/authentication")
const router = express.Router();

router.post("/book", authentication.authenticateToken, TicketController.bookTicket); 
router.get("/user/:userId", authentication.authenticateToken, TicketController.getTickets); 
router.put("/cancel", authentication.authenticateToken, TicketController.cancelTicket); 

module.exports = router;


