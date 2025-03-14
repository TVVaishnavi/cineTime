import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';
import '../../style/Dashboard.css';

function Adminhome() {
  const navigate = useNavigate();

  return (
    <div className='maincontainer'>
      <h1>Admin Page</h1>
      <Dashboard />
      <div className='dashboard-box'>
        <div className='section' onClick={() => navigate('/adminhome/movies')}>
          Movies
        </div>
        <div className='section' onClick={() => navigate('/adminhome/theatres')}>
          Theatres
        </div>
      </div>
      <div className='dashmain'>
        <Outlet />
      </div>
    </div>
  );
}

export default Adminhome;
