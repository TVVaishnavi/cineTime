import { useLocation, useNavigate } from "react-router-dom";
import React from 'react';

const Ticket = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const ticket = location.state?.ticket.data.data;

    if (!ticket) {
        return <h2>No ticket found!</h2>;
    }
    

    return (
        <div className="ticket-container">
            <h2>Ticket Confirmation</h2>
            <p><strong>User:</strong> {ticket.user}</p>
            <p><strong>Movie:</strong> {ticket.movieTitle}</p>
            <p><strong>Theatre:</strong> {ticket.theatreName}</p>
            <p><strong>Show Time:</strong> {ticket.showTime}</p>
            <p><strong>Seats:</strong> {ticket.seatNumbers}</p>
            <p><strong>Total Price:</strong> ₹{ticket.totalPrice}</p>
        </div>
    );
};

export default Ticket;
