import React, { useEffect, useState, useContext } from 'react';
import { MovieContext } from '../../hooks/controller'; 
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import { CgTrash } from 'react-icons/cg';
import { MdEditSquare } from 'react-icons/md';
import { RiSearchLine } from 'react-icons/ri';
import '../../style/movies.css'

function Movie() {
  const { movies, deleteMovie, setEditMovie, searchMovie, getMovies } = useContext(MovieContext); // ✅ Use useContext
  const navigate = useNavigate();
  const [movieTitle, setMovieTitle] = useState('');


  useEffect(() => {
    console.log("Fetching all movies...");
    getMovies(); 
  }, []);


  return (
    <div className='movie'>
      <h2 className='admin-title'>Admin Page</h2>
      <div className='movieHeader'>
        <div className='adsearch'>
          <label htmlFor='movieTitle'>Movie: </label>
          <input
            type='text'
            id='movieTitle'
            placeholder='Movie title'
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
          />
          <button type='submit' className='aSearch' onClick={searchMovie}>
            <RiSearchLine size={30} />
          </button>
        </div>
        <button className='create' onClick={() => navigate('/adminhome/createmovie')}>
          New Movie <IoMdAdd size={20} />
        </button>
      </div>

      {movies.length > 0 ? (
        movies.map((movie, index) => (
          <div key={index} className='movieItem'>
            <div className='info'>
              <div>🎬 {movie.title}</div>
              <div>🎭 Genre: {movie.genre}</div>
              <div>⏳ Duration: {movie.duration}</div>
              <div>🗣️ Language: {movie.language}</div>
              <div>📅 Release: {movie.releaseDate}</div>
              <div>⭐ Rating: {movie.rating}</div>
              <div>🏢 Theatre: {movie.theatre}</div>
              <div className='row'>
                <button className='edit' onClick={() => { setEditMovie(movie); navigate('/adminhome/EditMovie'); }}>
                  Edit <MdEditSquare size={25} />
                </button>
                <button className='delete' onClick={() => deleteMovie(movie._id)}>
                  Delete <CgTrash size={25} />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No movies found</p>
      )}
    </div>
  );
}

export default Movie;
