import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/CreateTheatre.css"; 

function CreateTheatre() {
  const navigate = useNavigate();
  const [theatre, setTheatre] = useState({
    name: "",
    location: "",
    movies: "",
  });

  const handleChange = (e) => {
    setTheatre({
      ...theatre,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const formattedTheatre = {
      ...theatre,
      movies: theatre.movies.split(",").map((movie) => movie.trim()),
    };

    try {
      const response = await fetch("http://localhost:3800/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedTheatre),
      });

      if (!response.ok) throw new Error("Failed to create theatre");

      const data = await response.json();
      console.log("Theatre added:", data);
      navigate("/adminhome"); 
    } catch (error) {
      console.error("Error creating theatre:", error);
    }
  };

  return (
    <div className="create-theatre-container">
      <h2>Create Theatre</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Theatre Name" onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
        <input type="text" name="movies" placeholder="Movies (comma separated)" onChange={handleChange} required />
        <button type="submit">Create Theatre</button>
      </form>
    </div>
  );
}

export default CreateTheatre;
