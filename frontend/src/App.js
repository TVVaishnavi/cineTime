import React from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Approutes from './routes/Approutes'
import Home from './pages/Home'
import Header from './components/Header'


function App() {
  return (
   <BrowserRouter>
    <div className='App'>
      <Header/>
      <Approutes/>
    </div>
   </BrowserRouter>
  )
}

export default App

