import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TheatreSeatGenerator from "./TheatreSeatGenerator";
import "../style/TheatreLayout.css";

const TheatreLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theatreData = location.state?.theatreData;

  const [selectedSeats, setSelectedSeats] = useState([]);
 
  useEffect(() => {
    if (!theatreData) {
      console.error("No theatre data found in navigation state!");
      navigate("/"); 
    } else {
      console.log(`Loaded theatre: ${theatreData.name}, Showtime: ${theatreData.showTime}`);
    }
  }, [theatreData, navigate]);

  useEffect(()=>{
    console.log(theatreData.availableSeats)
  },[])
  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatNumber)) {
        return prevSelectedSeats.filter((seat) => seat !== seatNumber);
      } else {
        return [...prevSelectedSeats, seatNumber];
      }
    });
  };

      const [user, setUser] = useState({});
  
      useEffect(() => {
          
              try {
                  const user =localStorage.getItem("userdetail");
                  if (user) {
                      setUser(JSON.parse(user));
                      console.log(user)
                  } else {
                      console.log("no user");
                  }
              } catch (error) {
                  console.error("Error retrieving user:", error);
              }
          
      }, [])

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:3800/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user.name,
          movieTitle: theatreData?.movieTitle,
          theatreName: theatreData?.name,
          showTime: theatreData?.showTime,
          seatNumbers: selectedSeats,
          totalPrice: selectedSeats.length * 200,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate ticket");
      }

      const ticketData = await response.json();
      console.log(ticketData)
      navigate("/Ticket", { state: { ticket: ticketData } });
    } catch (error) {
      console.error("Payment error:", error);
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
              bookedSeats={theatreData.bookedSeats || []}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
            <TheatreSeatGenerator
              seatData={theatreData.availableSeats?.premium?.rowB || []}
              rowLabel="B"
              seatType="premium"
              bookedSeats={theatreData.bookedSeats || []}
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
              bookedSeats={theatreData.bookedSeats || []}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
            <TheatreSeatGenerator
              seatData={theatreData.availableSeats?.regular?.rowD || []}
              rowLabel="D"
              seatType="regular"
              bookedSeats={theatreData.bookedSeats || []}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
            <TheatreSeatGenerator
              seatData={theatreData.availableSeats?.regular?.rowE || []}
              rowLabel="E"
              seatType="regular"
              bookedSeats={theatreData.bookedSeats || []}
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
              bookedSeats={theatreData.bookedSeats || []}
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
