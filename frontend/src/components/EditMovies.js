import React, { useContext, useEffect, useState } from 'react';
import "../style/EditMovies.css";
import { MovieContext } from '../hooks/controller';
import { useNavigate } from 'react-router-dom';

const EditMovie = () => {
    const [posterURL, setPosterURL] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [director, setDirector] = useState('');
    const [cast, setCast] = useState([]);
    const [rating, setRating] = useState('');
    const [duration, setDuration] = useState('');
    const [language, setLanguage] = useState('');
    const [theatres, setTheatres] = useState([]);
    const [availableSeats, setAvailableSeats] = useState({});
    const [bookedSeats, setBookedSeats] = useState([]);
    const navigate = useNavigate()
    const { movies, editMovie, updateMovie } = useContext(MovieContext);
    console.log(editMovie)
    useEffect(() => {
        if (editMovie) {
            setPosterURL(editMovie?.posterURL || '');
            setTitle(editMovie?.title || '');
            setDescription(editMovie?.description || '');
            setGenre(editMovie?.genre || '');
            setReleaseDate(editMovie?.releaseDate ? new Date(editMovie.releaseDate).toISOString().split("T")[0] : '');
            setDirector(editMovie?.director || '');
            setCast(editMovie?.cast || []);
            setRating(editMovie?.rating || '');
            setDuration(editMovie?.duration || '');
            setLanguage(editMovie?.language || '');
            setTheatres(editMovie?.theatres || []);
            setAvailableSeats(editMovie?.availableSeats || {});
            setBookedSeats(editMovie?.bookedSeats || []);
        }
    }, [editMovie]);

    const handleEditMovie = () => {
        const movieData = {
            posterURL,
            title,
            description,
            genre,
            releaseDate: new Date(releaseDate),
            director,
            cast: cast,
            rating: parseFloat(rating),
            duration: parseInt(duration),
            language,
            theatres,
            availableSeats,
            bookedSeats
        };
        updateMovie(movieData,editMovie._id);
        navigate('/adminhome/movies')
    };

    return (
        <div className="editMovie">
            <h2 className="admin-title">Edit Movie</h2>

            <div className="movieForm">
                <label>Poster URL:</label>
                <input type="text" value={posterURL} onChange={(e) => setPosterURL(e.target.value)} />

                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

                <label>Genre:</label>
                <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />

                <label>Release Date:</label>
                <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />

                <label>Director:</label>
                <input type="text" value={director} onChange={(e) => setDirector(e.target.value)} />

                <label>Cast (comma-separated):</label>
                <input type="text" value={cast.join(", ")} onChange={(e) => setCast(e.target.value.split(','))} />

                <label>Rating:</label>
                <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} />

                <label>Duration (mins):</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />

                <label>Language:</label>
                <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} />

                <label>Theatres:</label>
                <div>{theatres.map((th, i) =>
                    <div key={i}>
                        <h3>{th.name}</h3>
                        <p>{th.location}</p>
                        <label>showtime:</label>{th.showTimes.map((t, i) =>
                            <div key={i}>{t}</div>
                        )}
                    </div>
                )}</div>


                <label>Available Seats:</label>
                <textarea value={JSON.stringify(availableSeats, null, 2)} onChange={(e) => setAvailableSeats(JSON.parse(e.target.value))} />

                <label>Booked Seats (comma-separated):</label>
                <input type="text" value={bookedSeats.join(", ")} onChange={(e) => setBookedSeats(e.target.value.split(','))} />

                <button onClick={handleEditMovie}>Save</button>
            </div>
        </div>
    );
};

export default EditMovie;
