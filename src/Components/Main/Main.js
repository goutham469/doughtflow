import React, { useEffect, useState } from 'react'
import './Main.css'
import Login from '../Login/Login';
import NewPost from '../NewPost/NewPost';
import { BodyParser } from '../NewPost/controllers';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../Header/Header';
import { CiCircleChevDown } from "react-icons/ci";


function Main() {
  const [posts,setPosts] = useState([])
  const navigate = useNavigate()
  const {query} = useOutletContext();

  async function getData() 
  {
    let response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/all-posts`)
    response = await response.json()
    setPosts(response)
  }

  useEffect(()=>{
      getData();
  },[])
  function checkPostData(post)
  {
    console.log(query)
    if(!query)
    {
      return true
    }
    const isTitleMatch = post.title.toLowerCase().includes(query.toLowerCase());
        const isTechnologyMatch = post.technologies
            .map(tech => tech.toLowerCase().trim())
            .includes(query.toLowerCase().trim());
        return isTitleMatch || isTechnologyMatch;
  }
  return (
    <div className='main-body'>
        {
          posts.filter(post=>checkPostData(post))
          .map((post,idx)=><div className='main-body-child' key={idx}>
                        <center>
                          {
                            post.bannerImage&&<img style={{width:"300px",borderRadius:"20px"}} src={post.bannerImage}/>
                          }
                        </center>
                        <h2 style={{color:"brown"}} onClick={()=>{navigate('/post' , {state:{post}})}} className='post-title'>{post.title}</h2>
                        <div className='tags-parser'>
                          {
                            post.technologies.map(tag=><label className='main-tech-tag-parser'>{tag}</label>)
                          }
                        </div>
                        <BodyParser post={post.body}/>

                        <div className='see-more-tag'  onClick={()=>{navigate('/post' , {state:{post}})}} >
                          see more
                          <CiCircleChevDown className='see-more-tag-arrow'/>
                        </div>
                      </div>
                )
        }
        {/* {
          posts.map(post=><div className='main-body-child'>
                            <center>
                              {
                                post.bannerImage&&<img src={post.bannerImage}/>
                              }
                            </center>
                            <h2 style={{color:"brown"}} onClick={()=>{navigate('/post' , {state:{post}})}} className='post-title'>{post.title}</h2>
                            <BodyParser post={post.body}/>

                            <div className='see-more-tag'  onClick={()=>{navigate('/post' , {state:{post}})}} >
                              see more
                              <CiCircleChevDown className='see-more-tag-arrow'/>
                            </div>
                          </div>
                    )
        } */}
    </div>
  )
}

export default Main