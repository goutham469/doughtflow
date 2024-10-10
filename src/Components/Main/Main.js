import React, { useEffect, useState } from 'react'
import './Main.css'
import Login from '../Login/Login';
import NewPost from '../NewPost/NewPost';
import { BodyParser } from '../NewPost/controllers';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import { CiCircleChevDown } from "react-icons/ci";


function Main() {
  const [posts,setPosts] = useState([])
  const navigate = useNavigate()

  async function getData() 
  {
    let response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/all-posts`)
    response = await response.json()
    setPosts(response)
  }

  useEffect(()=>{
      getData();
  },[])
  return (
    <div className='main-body'>
        {
          posts.map(post=><div className='main-body-child'>
                            <center>
                              {
                                post.bannerImage&&<img src={post.bannerImage}/>
                              }
                            </center>
                            <h1 style={{color:"gold"}} onClick={()=>{navigate('/post' , {state:{post}})}} className='post-title'>{post.title}</h1>
                            <BodyParser post={post.body}/>

                            <div className='see-more-tag'  onClick={()=>{navigate('/post' , {state:{post}})}} >
                              see more
                              <CiCircleChevDown className='see-more-tag-arrow'/>
                            </div>
                          </div>
                    )
        }
    </div>
  )
}

export default Main