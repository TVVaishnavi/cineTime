import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import  Controller from '../hooks/controller';
import '../style/login.css';


function Login() {
  const [useremail, setuseremail]=useState('')
  const [password, setpassword]=useState('')
  const navigate=useNavigate();
  const {login}=Controller()

  const handleLogin = async()=>{
    if(!useremail || !password){
      alert("please enter both email and password")
      return
    }

    const result = await login({email: useremail, password})

    if(!result || !result.success){
      console.error("Login Failed:", result?.message || "unknown error")
      alert(result?.message || "login failed. please try again")
    }else{
      console.log("Login successful:", result.data)
    }
  }


  return (
    <div className='loginbody'>
    <div className='loginbox'>
      <div className='login'>
        <h2>Login</h2>
      </div>
      <div className='logindetails'>
        <div className='userNameoremail'>
          <label>UserEmail: </label>
          <input type='txt' required={true} placeholder='Enter userEmail' value={useremail} onChange={(e)=>setuseremail(e.target.value)}/>
        </div>
        <div className='loginpassword'>
          <label>Login password:</label>
          <input type='password' required={true} placeholder='Enter New password' value={password} onChange={(e)=>setpassword(e.target.value)}/>
        </div>
        <div className='submitbutton'>
          <button className='submit'onClick={handleLogin}>Submit</button>
          <p onClick={()=>navigate('/signup')}>Create account </p>
        </div>
      </div>
    </div>
    </div>
  )
} 

export default Login
