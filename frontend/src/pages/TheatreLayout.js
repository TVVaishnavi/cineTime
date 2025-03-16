import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TheatreSeatGenerator from "./TheatreSeatGenerator";
import "../style/TheatreLayout.css";

const TheatreLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theatreData = location.state?.theatreData;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!theatreData) {
      console.error("No theatre data found in navigation state!");
      navigate("/");
    } else {
      console.log(`Loaded theatre: ${theatreData.name}, Showtime: ${theatreData.showTime}`);
    }
  }, [theatreData, navigate]);

  useEffect(() => {
    if (theatreData) {
      console.log("Available Seats:", theatreData.availableSeats);
    }
  }, [theatreData]);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("userdetail");
      if (userData) {
        setUser(JSON.parse(userData));
        console.log("User loaded:", JSON.parse(userData));
      } else {
        console.log("No user found");
      }
    } catch (error) {
      console.error("Error retrieving user:", error);
    }
  }, []);

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seatNumber)
        ? prevSelectedSeats.filter((seat) => seat !== seatNumber)
        : [...prevSelectedSeats, seatNumber]
    );
  };

  const handlePayment = async () => {
    if (!user?.name) {
      alert("Please log in before booking.");
      return;
    }
    if (!theatreData) {
      alert("Theatre data is missing. Try again later.");
      return;
    }
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat before proceeding.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3800/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user.name,
          movieTitle: theatreData.movieTitle || "Unknown Movie",
          theatreName: theatreData.name || "Unknown Theatre",
          showTime: theatreData.showTime || "Unknown Time",
          seatNumbers: selectedSeats,
          totalPrice: selectedSeats.length * 200,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        throw new Error(errorResponse.error || "Failed to generate ticket");
      }

      const ticketData = await response.json();
      console.log("Ticket booked successfully:", ticketData);
      navigate("/Ticket", { state: { ticket: ticketData } });
    } catch (error) {
      console.error("Payment error:", error.message);
    }
  };

  return (
    <div className="theatre-layout">
      <h2>{theatreData?.name}</h2>

      {theatreData ? (
        <>
          <div className="seat-section premium">
            <h3>Premium</h3>
            <TheatreSeatGenerator
              seatData={theatreData.availableSeats?.premium?.rowA || []}
              rowLabel="A"
              seatType="premium"
              bookedSeats={theatreData.bookedSeats?.premium?.rowA || []}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
            <TheatreSeatGenerator
              seatData={theatreData.availableSeats?.premium?.rowB || []}
              rowLabel="B"
              seatType="premium"
              bookedSeats={theatreData.bookedSeats?.premium?.rowB || []}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
          </div>

          <div className="seat-section regular">
            <h3>Regular</h3>
            <TheatreSeatGenerator
              seatData={theatreData.availableSeats?.regular?.rowC || []}
              rowLabel="C"
              seatType="regular"
              bookedSeats={theatreData.bookedSeats?.regular?.rowC || []}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
            <TheatreSeatGenerator
              seatData={theatreData.availableSeats?.regular?.rowD || []}
              rowLabel="D"
              seatType="regular"
              bookedSeats={theatreData.bookedSeats?.regular?.rowD || []}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
          </div>

          <div className="seat-section recliner">
            <h3>Recliner</h3>
            <TheatreSeatGenerator
              seatData={theatreData.availableSeats?.recliner?.rowF || []}
              rowLabel="F"
              seatType="recliner"
              bookedSeats={theatreData.bookedSeats?.recliner?.rowF || []}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
          </div>

          {selectedSeats.length > 0 && (
            <button className="generate-ticket-btn" onClick={handlePayment}>
              Pay
            </button>
          )}
        </>
      ) : (
        <p>Loading seats...</p>
      )}
    </div>
  );
};

export default TheatreLayout;
