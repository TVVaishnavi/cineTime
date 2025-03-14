import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import Controller from '../hooks/controller'; 
import '../style/Signup.css'


function Signup() {
  const [username, setUsername] = useState('')
  const [useremail, setUseremail] = useState('')
  const Navigate = useNavigate()
  const [emailindicator, setEmailindicator] = useState(true)
  const [indicator, setIndicator] = useState(false)
  const [secpass, setSecpass] = useState('')
  const [conpass, setConpass] = useState('')
  const {signup} = Controller()

  const submit = async()=>{
    if(emailindicator){
      if (secpass === conpass){
        const data = {
          name: username,
          email: useremail,
          password: secpass
        }
        console.log(data)
        signup(data)
      }
      else{
        setIndicator(true)
      }
    }else{
      setIndicator(true)
    }
  }
  const checkemail = (email)=>{
    if(email.includes('@gmail.com') || email === ''){
      setEmailindicator(true)
    }else{
      setEmailindicator(false)
    }
  }
  return (
    <div className='signupbody'>
      <div className='signupbox'>
        <div className='signup'>
          <h2>Signup</h2>
        </div>
        <div className='signupdetails'>
          <div className='userName'>
            <label>userName: </label>
            <input type='txt' required placeholder='Enter user Name' value={username} onChange={(e)=>setUsername(e.target.value)}/>
          </div>
          <div className='email'>
            <label>Email: </label>
            <input type='txt' required placeholder='Enter Email id' value={useremail} onChange={(e)=>{setUseremail(e.target.value);checkemail(e.target.value)}}/>
            {emailindicator ? null : <p style ={{color: 'red'}}>Email is incorrect</p>}
          </div>
          <div className='password'>
            <label>Create password: </label>
            <input type='password' required placeholder='Enter New password' value={secpass} onChange={(e)=>setSecpass(e.target.value)}/>
          </div>
          <div className='correctpassword'>
            <label>Confirm password: </label>
            <input type='password' required placeholder='Enter confirm password' value={conpass} onChange={(e)=>setConpass(e.target.value)}/>
            {indicator ? <p style={{color: 'red'}}>Incorrect Password</p>: null}
          </div>
          <div className='statement'>
            <button className='submit' onClick={()=> submit()}>Submit</button>
            <p onClick={()=>Navigate('/login')}>Already has account?</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup  