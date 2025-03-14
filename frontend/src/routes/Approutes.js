import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import Search from '../pages/Search';
import Home from '../pages/Home';
import MovieResult from '../pages/MovieResult';
import TheatreSelect from '../pages/TheatreSelect';
import TheatreLayout from '../pages/TheatreLayout';
import Ticket from '../pages/Ticket';
import Adminhome from '../pages/admin/adminHome';
import Movie from '../pages/admin/movie';
import Theatre from '../pages/admin/Theatre';
import CreateMovie from '../components/CreateMovie';
import CreateTheatre from '../components/CreateTheatre';
import EditMovie from '../components/EditMovies';
import EditTheatre from '../components/EditTheatre';
import Profile from '../components/Profile';

function Approutes() {
  return (
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/search' element={<Search />} />
      <Route path='/home' element={<Home />} />
      <Route path='/movieresult' element={<MovieResult />} />
      <Route path='/theatreselect/:title' element={<TheatreSelect />} />
      <Route path='/theatrelayout' element={<TheatreLayout />} />
      <Route path='/ticket' element={<Ticket />} />
      <Route path='/Profile' element={<Profile/>}/>

      {/* Admin Routes */}
      <Route path='/adminhome' element={<Adminhome />}>
        <Route path='movies' element={<Movie />} />
        <Route path='createmovie' element={<CreateMovie />} />
        <Route path='EditMovie' element={<EditMovie/>}/>
        <Route path='theatres' element={<Theatre />} />
        <Route path='createtheatre' element={<CreateTheatre />} />
        <Route path='EditTheatre' element={<EditTheatre/>}/>
      </Route>
    </Routes>
  );
}

export default Approutes;
