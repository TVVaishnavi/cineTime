import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/TheatreSelect.css";
import api from "../api/backend";

const TheatreSelect = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(getFormattedDate(0)); // Default to today

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const decodedTitle = decodeURIComponent(title);
        console.log("Fetching theatres for:", decodedTitle, "on date:", selectedDate);

        const response = await fetch(
          `http://localhost:3800/api/movies/`
        ,{method:'POST',        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({title:title})});

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Theatres:", data);
        setTheatres(data || []);
      } catch (err) {
        console.error("Error fetching theatres:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTheatres();
  }, [title, selectedDate]); 

  const handleShowtimeClick = async (theatre, showtime,tn) => {
    try {
      console.log("Fetching seat details for theatre:", theatre._id);
      
      const theatreWithSeats = {
        ...theatre,
        showTime: showtime,
        availableSeats: tn[0].availableSeats || {},  
        bookedSeats: tn[0].bookedSeats || []  ,
        movieTitle:tn[0].title
      };
  
      navigate("/TheatreLayout", { state: { theatreData: theatreWithSeats } });
      
    } catch (error) {
      console.error("Error fetching seat details:", error);
      setError(error.message);
    }
  };
  

  return (
    <div className="theatre-container">
      {error && (
      <div className="error-message">
        Error: {error}
        <button onClick={() => setError("")}>Dismiss</button>
      </div>
      )}
      <h2>Available Theatres for {decodeURIComponent(title)}</h2>

      {/* Date Selector */}
      <div className="date-selector">
        {getNext7Days().map((date) => (
          <button
            key={date}
            className={`date-button ${selectedDate === date ? "selected" : ""}`}
            onClick={() => setSelectedDate(date)}
          >
            {formatDate(date)}
          </button>
        ))}
      </div>

      {loading && <p>Loading theatres...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && theatres.length === 0 && <p>No theatres found for this date.</p>}
      
      {!loading && !error &&
        theatres[0].theatres
        .map((theatre, index) => (
          <div key={index} className="theatre-box">
            <div className="theatre-info">
              <h3 className="theatre-name">{theatre.name}</h3>
              <p className="theatre-location">{theatre.location}</p>
            </div>
            <div className="showtimes">
              {theatre.showTimes.map((showtime, idx) => (
                <button
                  key={idx}
                  className="showtime-btn"
                  onClick={() => handleShowtimeClick(theatre,showtime,theatres)}
                >
                  {showtime}
                </button>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  );
};

// Helper function: Get next 7 days
const getNext7Days = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split("T")[0]); // YYYY-MM-DD format
  }
  return dates;
};

// Helper function: Format date like "Sun 02 Mar"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
};

const getFormattedDate = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0]; 
};

export default TheatreSelect;
