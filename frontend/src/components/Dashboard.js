import React from 'react'
import { useNavigate } from 'react-router-dom'
import Controller from '../hooks/controller'
import '../style/Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const {getMovies, getTheatre} = Controller()

  return (
    <div className='dashcontainer'>
      <div className='sidebar' onClick={()=>{
        getMovies()
        navigate('/adminhome/movies')
      }}>
      </div>
      <div className='sidebar' onClick={()=>{
        getTheatre()
        navigate('/adminhome/theatre')
      }}>
      </div>
    </div>
  )
}

export default Dashboard 
