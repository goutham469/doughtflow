import React, { useState } from 'react'
import './Header.css'
import Images from '../Images'
import { CiSearch } from 'react-icons/ci';
import { IoMoonOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function Header({queryHandler}) {
  const [searchQuery , setSearchQuery] = useState();
  const [theme,setTheme] = useState(localStorage.getItem('theme'))
  const navigate = useNavigate();

  function toggleTheme(cur_theme) {

    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = cur_theme
    document.documentElement.setAttribute("data-theme", newTheme);
    
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  }

  return (
    <header className='header'>
      <div style={{cursor:"pointer"}} onClick={()=>navigate('/')}>
        <img src={Images.appIcon} className='header-app-icon'/>
        <b>Dought Flow</b>
      </div>
      <form
        className='search-bar'
        onSubmit={(event)=>{
            event.preventDefault();
          }}
        >
            <CiSearch className='search-icon'/>
            <input
                className='search-input'
                type='text' 
                placeholder='search any thing'
                onChange={(event)=>{
                  // setSearchQuery(event.target.value)
                  queryHandler(event.target.value)
                }}
            />
        </form>

        <div style={{display:"flex",justifyContent:"space-around"}}>
          <div className='profile-button' onClick={()=>navigate('/login')}>
            {
              localStorage.getItem('email') ?
              <div>
                <IoPersonCircleOutline />
              </div>
              :
              <div>
                <IoPersonCircleOutline className='profile-icon'/>
                <label>Login</label>
              </div>
            }
          </div>
          <span className='toggle-theme-icon profile-button'>
            {
                theme ?
                theme === "light" ? 
              <IoMoonOutline onClick={()=>toggleTheme("dark")} />
              :
              <IoSunnyOutline onClick={()=>toggleTheme("light")} />
              :
              <IoMoonOutline onClick={()=>toggleTheme("light")} />
            }
          </span>
          <label className='new-post-button' onClick={()=>navigate('/new')}>new post</label>
        </div>

    </header>
  )
}

export default Header