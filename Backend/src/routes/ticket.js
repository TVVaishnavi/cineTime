const express = require("express")
const { bookTicket ,cancelTicket } = require('../controller/ticket')
const router = express.Router()
const bookSeat = require("../service/bookSeat")

router.post("/book", bookTicket) 
//router.post("/bookseat", bookSeat)
router.delete('/cancel/:ticketId', cancelTicket)

module.exports = router
