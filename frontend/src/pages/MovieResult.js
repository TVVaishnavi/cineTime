import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../style/MovieResult.css'


const MovieResult = () => {
  const location = useLocation();
  const movies = location.state?.movies || [];
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate()

  const handleBookTicket = (movieTitle)=>{
    const formattedTitle = encodeURIComponent(movieTitle)
    navigate(`/TheatreSelect/${formattedTitle}`)
  }

  useEffect(() => {
    if (movies.length > 0) {
      setSearchResults(movies);
    }
  }, [movies]);

  return (
    <div>
      <h2>Search Results</h2>
      {searchResults.length > 0 ? (
        searchResults.map((movie) => (
          <div key={movie._id} className="movie-container">
            <div className="movie-left">
              <img src={movie.posterURL} alt={movie.title} className="movie-image" />
              <p className="movie-description">{movie.description}</p>
            </div>

            <div className="movie-details">
              <h3>{movie.title}</h3>
              <p><strong>Genre:</strong> {movie.genre}</p>
              <p><strong>Director:</strong> {movie.director}</p>
              <p><strong>Cast:</strong>{movie.cast}</p>
              <p><strong>Language:</strong> {movie.language}</p>
              <p><strong>Rating:</strong> {movie.rating}</p>
              <button className="book-ticket" onClick={()=>handleBookTicket(movie.title)}>Book Ticket</button>
            </div>
          </div>
        ))
      ) : (
        <p>No movies found.</p>
      )}
    </div>
  );
};

export default MovieResult;
