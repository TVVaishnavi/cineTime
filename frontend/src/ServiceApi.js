import axios from 'axios';

const API_URL = 'http://localhost:3800/api/movies/:{movieTitle}';

export const getTheatresByMovie = async (movieTitle) => {
  try {
    const encodedTitle = encodeURIComponent(movieTitle);
    const response = await axios.get(`${API_URL}/theatres/movie/${encodedTitle}`);
    return response.data.theatres;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching theatres');
  }
};
