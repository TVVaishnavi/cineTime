const express = require("express")
const { bookTicket ,cancelTicket } = require('../../controller/movies/ticket')
const router = express.Router()

router.post("/book", bookTicket) 
router.delete('/cancel/:ticketId', cancelTicket)

module.exports = router
