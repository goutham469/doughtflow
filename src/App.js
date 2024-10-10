import { useEffect, useState } from 'react';
import './App.css';
import Header from './Components/Header/Header';
import Main from './Components/Main/Main';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Components/Login/Login';
import NewPost from './Components/NewPost/NewPost';
import PostCard from './Components/Main/PostCard';
import Master from './Components/Master/Master';

function App() {
  const [websiteCount , setWebsiteCount] = useState()

  async function updateServerCount()
  {
       let data = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/client`)
       data = await data.json()
       setWebsiteCount(data.websiteCalls)
  }
  function toggleTheme(cur_theme) {

    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = cur_theme
    document.documentElement.setAttribute("data-theme", newTheme);
    
    localStorage.setItem("theme", newTheme);
  }
  useEffect(()=>{
    updateServerCount()
    toggleTheme(localStorage.getItem("theme"))
  },[])

  const router = createBrowserRouter([
    {
      path:'',
      element:<Master />,
      children:[
        {
          path:'',
          element:<Main/>
        },
        {
          path:'login',
          element:<Login/>
        },
        {
          path:'new',
          element:<NewPost/>
        },
        {
          path:'post',
          element:<PostCard/>
        }
      ]
    }
  ])

  return (
    <div className="App">
        <div>
          <RouterProvider router={router}/>
        </div>
    </div>
  );
}

export default App;
