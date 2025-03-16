import { useLocation, useNavigate } from "react-router-dom";
import React from 'react';

const Ticket = () => {
    const location = useLocation();
    const navigate = useNavigate();

    console.log("Location state:", location.state);

    const ticket = location.state?.ticket?.ticket || location.state?.ticket;

    if (!ticket) {
        navigate("/"); // Redirect if no data
        return null;
    }

    return (
        <div className="ticket-container">
            <h2>Ticket Confirmation</h2>
            <p><strong>User:</strong> {ticket.user}</p>
            <p><strong>Movie:</strong> {ticket.movieTitle}</p>
            <p><strong>Theatre:</strong> {ticket.theatreName}</p>
            <p><strong>Show Time:</strong> {ticket.showTime}</p>
            <p><strong>Seats:</strong> {Array.isArray(ticket.seatNumbers) ? ticket.seatNumbers.join(", ") : "No seats selected"}</p>
            <p><strong>Total Price:</strong> ₹{ticket.totalPrice}</p>
        </div>
    );
};

export default Ticket;
