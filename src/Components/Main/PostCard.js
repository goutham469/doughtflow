import React from 'react'
import './Main.css'
import { BodyParser } from '../NewPost/controllers'
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";

function PostCard() {
    const location = useLocation();
    const navigate = useNavigate();

    let {post} = location.state;
  return (
    <div className='complete-post'>

        <label 
        className='complete-post-back-button'
        onClick={()=>navigate('/')}
        ><IoIosArrowBack/> back</label>
        <br/>

        <center>
        {
            post.bannerImage&&<img src={post.bannerImage}/>
        }
        </center>
        <center><h1 style={{color:"brown"}}>{post.title}</h1></center>
        <BodyParser post={post.body}/>
        <div className='tags-parser'>
          {
            post.technologies.map(tag=><label className='tech-tag-parser'>{tag}</label>)
          }
        </div>
    </div>
  )
}

export default PostCard