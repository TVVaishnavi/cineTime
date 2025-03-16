import React from "react";
import "../style/TheatreLayout.css";

const TheatreSeatGenerator = ({ seatData, rowLabel, seatType, bookedSeats, selectedSeats = [], onSeatSelect = () => {} }) => {
  return (
    <div className="seat-container">
      {seatData.map((seat, index) => {
        const seatNumber = `${rowLabel}${index + 1}`;
        const isBooked = bookedSeats.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);

        return (
          <button
            key={seatNumber}
            className={`seat ${seatType} ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
            onClick={() => !isBooked && onSeatSelect(seatNumber)}
            disabled={isBooked}
            data-seat={seatNumber} // ✅ Added for Cypress testing
          >
            {seatNumber}
          </button>
        );
      })}
    </div>
  );
};

export default TheatreSeatGenerator;
