import React, { useEffect, useState } from 'react';
import { useTheatreList } from '../hooks/controller';
import "../style/EditTheatre.css"

const EditTheatre = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [movies, setMovies] = useState([]);

    const { editTheatre, updateTheatre } = useTheatreList();

    const handleEditTheatre = () => {
        const theatreData = { name, location, movies };
        updateTheatre(theatreData);
    };

    const handleMoviesChange = (e) => {
        setMovies(e.target.value.split(',').map(movie => movie.trim()));
    };

    useEffect(() => {
        if (editTheatre) {
            setName(editTheatre?.name || '');
            setLocation(editTheatre?.location || '');
            setMovies(editTheatre?.movies || []);
        }
    }, [editTheatre]);

    return (
        <div className="editTheatre">
            <div>
                <label>Theatre Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label>Location:</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
                <label>Movies Playing (comma-separated):</label>
                <input type="text" value={movies.join(', ')} onChange={handleMoviesChange} />
            </div>
            <div>
                <button onClick={handleEditTheatre}>Save</button>
            </div>
        </div>
    );
};

export default EditTheatre;
