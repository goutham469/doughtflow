import React from 'react'
import './Login.css'
import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Images from '../Images';

function Login() {
  async function success(response)
  {
    response = jwtDecode(response.credential)
    // console.log(response)

    let data = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/login`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        email:response.email,
        img : response.picture
      })
    })
    data = await data.json()

    // console.log(data)
    if(data.acknowledged)
    {
      localStorage.setItem('email',response.email)
    }
    else
    {
      if(data.message)
      {
        localStorage.setItem('email',response.email)
      }
      else
      {
        alert("some thing gone wrong !")
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
    </center>
  )
}

export default Login