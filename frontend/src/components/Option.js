import React from 'react'
import '../style/header.css'

function Option({ishidden}) {
  return (
    <ul  className='options'>
      <li>Account</li>
      <li>Profile</li>
      <li>Logout</li>
    </ul>
  )
}

export default Option