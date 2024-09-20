import React from 'react'
import './LoginForm.css'
import { CgProfile } from "react-icons/cg";
import { FaLock } from "react-icons/fa";

const LoginForm= () => {
  return (
    <div className='wrapper'>
      <form action=''>
        <h1>Login</h1>
        <div className='input-box'>
          <input type="text" placeholder='Username' required />
          < CgProfile className='icon'/>
        </div>
        <div className='input-box'>
          <input type="text" placeholder='Password' required />
          < FaLock className='icon'/>
        </div>
        <div className='remember-forgot'>
          <label><input type="checkbox" />Remember me</label>
          <a href='#'>Forgot password?</a>
        </div>

        <button type='submit'>LogIn</button>

        <div className='register-link'>
         <p>Don't have an account? <a href='#'>Register</a></p>
        </div>

        {/* <div className='login-github'>
         <p>Login with <a href='#'>Github</a></p>
        </div> */}

        <button type='login-github'> <p>Login with <a href='#'>Github</a></p></button>

      </form>

    </div>
  );
};

export default  LoginForm;
