import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/CreateMovies.css";

function CreateMovie() {
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    posterURL: '',
    title: '',
    description: '',
    genre: '',
    releaseDate: '',
    director: '',
    cast: '',
    rating: '',
    duration: '',
    language: '',
    theatres: [],
  });

  const [theatre, setTheatre] = useState({
    name: '',
    location: '',
    showTimes: '',
    seatLayout: {
      premium: { rows: ["A", "B"], bookedSeats: [] },
      regular: { rows: ["C", "D", "E"], bookedSeats: [] },
      recliner: { rows: ["F"], bookedSeats: [] }
    },
  });

  const generateSeats = (rows) => {
    return rows.flatMap(row => Array.from({ length: 10 }, (_, i) => `${row}${i + 1}`));
  };

  const handleChange = (e) => {
    setMovie({
      ...movie,
      [e.target.name]:
        e.target.name === "duration" || e.target.name === "rating"
          ? Number(e.target.value) || ''
          : e.target.value,
    });
  };

  const handleTheatreChange = (e) => {
    setTheatre({
      ...theatre,
      [e.target.name]: e.target.value,
    });
  };

  const handleSeatChange = (category, value) => {
    const bookedSeats = value.split(",").map(s => s.trim()).filter(s => s);
    const availableSeats = generateSeats(theatre.seatLayout[category].rows).filter(seat => !bookedSeats.includes(seat));

    setTheatre({
      ...theatre,
      seatLayout: {
        ...theatre.seatLayout,
        [category]: { 
          rows: theatre.seatLayout[category].rows, 
          bookedSeats, 
          availableSeats 
        },
      },
    });
  };

  const handleAddTheatre = () => {
    if (!theatre.name.trim() || !theatre.location.trim() || !theatre.showTimes.trim()) return;

    setMovie({
      ...movie,
      theatres: [
        ...movie.theatres,
        {
          name: theatre.name.trim(),
          location: theatre.location.trim(),
          showTimes: theatre.showTimes.split(",").map(time => time.trim()),
          seatLayout: {
            premium: {
              rows: ["A", "B"],
              bookedSeats: theatre.seatLayout.premium.bookedSeats,
              availableSeats: generateSeats(["A", "B"]).filter(seat => !theatre.seatLayout.premium.bookedSeats.includes(seat)),
            },
            regular: {
              rows: ["C", "D", "E"],
              bookedSeats: theatre.seatLayout.regular.bookedSeats,
              availableSeats: generateSeats(["C", "D", "E"]).filter(seat => !theatre.seatLayout.regular.bookedSeats.includes(seat)),
            },
            recliner: {
              rows: ["F"],
              bookedSeats: theatre.seatLayout.recliner.bookedSeats,
              availableSeats: generateSeats(["F"]).filter(seat => !theatre.seatLayout.recliner.bookedSeats.includes(seat)),
            },
          },
        },
      ],
    });

    setTheatre({
      name: '',
      location: '',
      showTimes: '',
      seatLayout: {
        premium: { rows: ["A", "B"], bookedSeats: [] },
        regular: { rows: ["C", "D", "E"], bookedSeats: [] },
        recliner: { rows: ["F"], bookedSeats: [] }
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedMovie = {
      ...movie,
      cast: movie.cast.split(",").map(name => name.trim()),
    };

    try {
      const response = await fetch('http://localhost:3800/api/movies/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedMovie),
      });

      if (!response.ok) throw new Error("Failed to add movie");
      const data = await response.json();
      console.log("Movie added:", data);
      navigate('/adminhome');

    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  return (
    <div>
      <h2>Create New Movie</h2>
      <form onSubmit={handleSubmit}>
        <input type='text' name='posterURL' placeholder="Poster URL" onChange={handleChange} required />
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="text" name="genre" placeholder="Genre" onChange={handleChange} required />
        <input type="date" name="releaseDate" onChange={handleChange} required />
        <input type="text" name="director" placeholder="Director" onChange={handleChange} required />
        <input type="text" name="cast" placeholder="Cast (comma separated)" onChange={handleChange} required />
        <input type="number" name="rating" placeholder="Rating (0-10)" onChange={handleChange} required />
        <input type="number" name="duration" placeholder="Duration (in minutes)" onChange={handleChange} required />
        <input type="text" name="language" placeholder="Language" onChange={handleChange} required />

        <div>
          <h3>Add Theatre</h3>
          <input type="text" name="name" value={theatre.name} placeholder="Theatre Name" onChange={handleTheatreChange} required />
          <input type="text" name="location" value={theatre.location} placeholder="Theatre Location" onChange={handleTheatreChange} required />
          <input type="text" name="showTimes" value={theatre.showTimes} placeholder="Showtimes (comma separated)" onChange={handleTheatreChange} required />

          <h4>Seat Layout</h4>
          <div>
            <strong>Premium Seats (Rows: A, B)</strong>
            <input type="text" placeholder="Booked Seats (comma separated)" value={theatre.seatLayout.premium.bookedSeats.join(", ")} onChange={(e) => handleSeatChange("premium", e.target.value)} />
          </div>
          <div>
            <strong>Regular Seats (Rows: C, D, E)</strong>
            <input type="text" placeholder="Booked Seats (comma separated)" value={theatre.seatLayout.regular.bookedSeats.join(", ")} onChange={(e) => handleSeatChange("regular", e.target.value)} />
          </div>
          <div>
            <strong>Recliner Seats (Row: F)</strong>
            <input type="text" placeholder="Booked Seats (comma separated)" value={theatre.seatLayout.recliner.bookedSeats.join(", ")} onChange={(e) => handleSeatChange("recliner", e.target.value)} />
          </div>

          <button type="button" onClick={handleAddTheatre}>Add Theatre</button>
        </div>

        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
}

export default CreateMovie;
