import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/backend';

export const MovieContext = createContext();
export const TheatreContext = createContext();

const Controller = () => {
  const navigate = useNavigate()
  const [userDetail, setUserDetail] = useState({});
  const [userLogin, setUserLogin] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchDetails, setSearchDetails] = useState(null);
  const [TheatreResult, setTheatreResults] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  const signup = async (user) => {
    try {
      console.log('User Data:', user);
      const response = await api.post('/register', user);

      if (!response.data.permission) {
        alert(response.data.message);
      } else {
        alert('Signup Successful!');
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
      console.error('Error:', err);
    }
  };

  const findUser = () => {
    try {
      const user = localStorage.getItem("userdetail");
      if (user) {
        setUserDetail(JSON.parse(user));
        setUserLogin(true);
      } else {
        setUserLogin(false);
      }
    } catch (error) {
      console.error("Error retrieving user:", error);
    }
  };

  const saveUser = (user) => {
    try {
      localStorage.setItem("userdetail", JSON.stringify(user));
      setUserDetail(user);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const saveToken = (token) => {
    try {
      localStorage.setItem("usertoken", token);
    } catch (error) {
      console.error("Error saving token", error);
    }
  };

  const login = async (userData) => {
    try {
      const response = await fetch('http://localhost:3800/user/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      console.log("API Response:", data); 

      if (!data.result || !data.result.role) {
        console.error("Role is missing in API response:", data);
        return { success: false, message: "Invalid response from server" };
      }
      console.log(data.result)
      saveToken(data.result.token);
      saveUser({email:data.result.email,name:data.result.name, role: data.result.role });

      if (data.result.role === 'admin') {
        setAdmin(true);
        navigate('/adminhome');
      } else {
        setAdmin(false);
        navigate('/search');
      }
      return { success: true, data };

    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: err.response?.data?.message || "Network error. Please try again." };
    }
  };


  const logout = () => {
    try {
      localStorage.removeItem("userdetail");
      localStorage.removeItem("usertoken");
      setUserDetail(null);
      setUserLogin(false);
      setAdmin(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    findUser();
  }, []);

  const SearchTheatre = async (theatreData) => {
    try {
      const response = await api.get('/api/search', { params: theatreData });
      
      if (response.data?.length > 0) {
        setSearchResults(response.data);
        setSearchDetails(theatreData);
        navigate('/theatre-results');
      } else {
        alert("No theatres found");
      }
    } catch (error) {
      alert("Search failed. Please try again.");
    }
  };

  const SearchMovie = async (data) => {
    try {
      console.log(data)
      const response = await api.post('/api/movies', data); 
      console.log(response.data);

      if (response.data && response.data.length > 0) {
        setSearchResults(response.data);  
        setSearchDetails(data);
        navigate('/movieresult', { state: { movies: response.data } }); 
      } else {
        alert("No movies found");
      }
    } catch (err) {
      console.log("Error fetching movies:", err);
      alert("Movies not found");
    }
};


  const SearchTheatres = async (title) => {
    try {
      const response = await api.get("/api/search", title);

      if (response.data?.theatres?.length > 0) {
        setTheatreResults(response.data.theatres);
        setSearchDetails(title);
        navigate('/TheatreResult', { state: { theatres: response.data.theatres } });
      } else {
        console.log("No theatres found for this movie.");
      }
    } catch (error) {
      console.log("Error fetching theatre data:", error);
    }
  };

  const selectTheatre = (theatre) => setSelectedTheatre(theatre);
  const selectShowtime = (time) => setSelectedShowtime(time);

  return {
    signup, userDetail, userLogin, isAdmin, login, logout,
    SearchTheatre, SearchMovie, searchDetails, searchResults,
    selectedTheatre, selectedShowtime, SearchTheatres,
    selectTheatre, selectShowtime
  };
};

const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [editMovie, setEditMovie]=useState({})

  const getMovies = async () => {
    try {
      console.log("nkn")
      const response = await fetch("http://localhost:3800/api/movies/get", { method: "POST" });
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovies(data.movies);
      console.log(data.movies)
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      await fetch("http://localhost/api/movies/:movieId", { method: "DELETE" });
      setMovies(movies.filter(movie => movie._id !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const  updateMovie=async(d,id)=>{
    try {
      await fetch(`http://localhost/api/movies/${id}`, { method: "PUT" ,headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d)});
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  }

  return (
    <MovieContext.Provider value={{ movies, updateMovie, getMovies, editMovie,deleteMovie,setEditMovie }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieList = () => {
  const [movies, setMovies] = useState([]);
  const [editMovie, setEditMovie] = useState(null);

  const updateMovie = (updatedMovie) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === updatedMovie.id ? updatedMovie : movie
      )
    );
  };

  return { movies, editMovie, setEditMovie, updateMovie };
};

const TheatreProvider = ({ children }) => {
  const [theatres, setTheatres] = useState([]);
  const [editTheatre,setEditTheatre] =useState({})
  const getTheatres = async () => {
    try {
      const response = await fetch("http://localhost:3800/api/all", { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch theatres");
      const data = await response.json();
      setTheatres(data.theatres);
      console.log(data)
    } catch (error) {
      console.error("Error fetching theatres:", error);
    }
  };

  const deleteTheatre = async (id) => {
    try {
      await fetch("http://localhost:3800/api/theatres/${id}", { method: "DELETE" });
      setTheatres(prevTheatres => prevTheatres.filter(theatre => theatre._id !== id));
    } catch (error) {
      console.error("Error deleting theatre:", error);
    }
  };

  const searchTheatre=async(data)=>{
     const fil=theatres.filter((m)=>{
      if(m.name.includes(data.name)) return m
     })
     setTheatres(fil)
  }

  useEffect(() => {
    getTheatres();
  }, []);

  return (
    <TheatreContext.Provider value={{ theatres, getTheatres,editTheatre, setEditTheatre,searchTheatre,deleteTheatre }}>
      {children}
    </TheatreContext.Provider>
  );
};

export const useTheatreList = () => {
  const [theatres, setTheatres] = useState([]);
  const [editTheatre, setEditTheatre] = useState(null);

  const updateTheatre = (updatedTheatre) => {
    setTheatres((prevTheatres) =>
      prevTheatres.map((theatre) =>
        theatre.id === updatedTheatre.id ? updatedTheatre : theatre
      )
    );
  };

  return { theatres, editTheatre, setEditTheatre, updateTheatre };
};

export { MovieProvider, TheatreProvider };
export default Controller;

