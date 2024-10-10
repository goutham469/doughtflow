import React from 'react'
import { useState } from 'react';
import './Login.css'
import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Images from '../Images';
import Notification from '../../Utils/ProgressBar';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  async function success(response)
  {
    response = jwtDecode(response.credential)

    let data = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/login`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        email:response.email,
        img : response.picture
      })
    })
    data = await data.json()

    if(data.acknowledged)
    {
      localStorage.setItem('email',response.email)
      setNotification({ message: 'Login success', color: 'green' });
      setTimeout(()=>{
        navigate('/')
      },3000)

    }
    else
    {
      if(data.message)
      {
        localStorage.setItem('email',response.email)
        setNotification({ message: 'Login success', color: 'green' });
        setTimeout(()=>{
          navigate('/')
        },3000)
      }
      else
      {
        setNotification({ message: 'Login failed', color: 'red' });
      }
    }
  }
  
  return (
    <center>
      <div className='login-user'>
        {
          localStorage.getItem('email')?
          <div>
            <b>{localStorage.getItem('email')}</b>
            <br/>
            <button onClick={(event)=>{
              event.preventDefault();
              localStorage.removeItem('email')
              setNotification({ message: '"Logout" success', color: 'green' });

            }}>logout</button>
          </div>
          :
          <div>
            <div>
              <img src={Images.appIcon} className='header-app-icon'/>
              <b>Dought Flow</b>
            </div>
            <br/><br/>
            <b>Log in</b>
            <br/><br/>

            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}>
                <GoogleLogin 
                onSuccess={success}
                />
            </GoogleOAuthProvider>

            <br/><br/>
            <b style={{color:"blue"}}>cookie policy</b>
          </div>
        }
      </div>
      {
        notification && (
        <Notification 
          message={notification.message} 
          color={notification.color}
          onClose={() => setNotification(null)} 
        />
      )}
    </center>
  )
}

export default Login