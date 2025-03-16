const {  bookMovieTicket , cancelMovieTicket } = require('../service/ticket');

// controllers/bookingController.js
const bookTicket = (req, res) => {
    console.log("Received request body:", req.body); // Debugging

    const { user, movieTitle, theatreName, showTime, seatNumbers, totalPrice } = req.body;

    if (!user || !movieTitle || !theatreName || !showTime || !seatNumbers || !totalPrice) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    res.json({
        message: "Booking successful",
        ticket: { user, movieTitle, theatreName, showTime, seatNumbers, totalPrice }
    });
};




const cancelTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await cancelMovieTicket(id);

        if (response.error) {
            return res.status(404).json({ error: response.error });
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = { bookTicket, cancelTicket };
