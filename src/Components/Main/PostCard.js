import React, { useEffect } from 'react'
import './Main.css'
import { BodyParser } from '../NewPost/controllers'
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { BsCalendarDate } from "react-icons/bs";

function PostCard() {
  const location = useLocation();
  const navigate = useNavigate();

  const { post } = location.state;
  
  // Handle cases where post data might be missing
  if (!post) {
    return (
      <div className="complete-post error-state">
        <button 
          className='complete-post-back-button'
          onClick={() => navigate('/')}
        >
          <IoIosArrowBack /> Back to posts
        </button>
        <div className="error-message">
          <h2>Post not found</h2>
          <p>The post you're looking for is not available or has been removed.</p>
        </div>
      </div>
    );
  }

  

  return (
    <div className='complete-post'>
      <button 
        className='complete-post-back-button'
        onClick={() => navigate('/')}
      >
        <IoIosArrowBack /> Back to posts
      </button>

      {post.bannerImage && (
        <div className="post-full-image">
          <img src={post.bannerImage} alt={post.title} />
        </div>
      )}

      <div className="post-header">
        <h1>{post.title}</h1>
        
        {post.createdAt && (
          <div className="post-meta">
            <BsCalendarDate />
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            })}</span>
          </div>
        )}
      </div>

      <div className="post-body">
        <BodyParser post={post.body} />
      </div>
      
      <div className="post-footer">
        <div className='tags-parser'>
          {post.technologies.map((tag, idx) => (
            <span key={idx} className='tech-tag-parser'>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PostCard