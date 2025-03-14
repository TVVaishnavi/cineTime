import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiAccountCircleFill } from "react-icons/ri";

function Account() {
  const [profile, setProfile] = useState(false)
  const Navigate = useNavigate()
  const handleButton = () => {
    setProfile(!profile)
  }
  return (
    <div className='account-container'> 
      <div className="account" onMouseEnter={handleButton}
        onMouseLeave={handleButton}>
        Account
      </div>
      <RiAccountCircleFill />
    </div>
  )
}

export default Account; 
