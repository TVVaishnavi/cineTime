import React, {useState} from 'react';
import Search from './Search';
import '../style/Home.css';

function Home() {
  const [showMovies, setShowMovies] = useState(false)
  return (
    <div className='home'>
        <div className='container'>
           <h1 className='title'><div>Welcome To</div><span className='titlename'>CinemaZone</span></h1>
        </div>
         <Search/>
    </div>
  )
}

export default Home
