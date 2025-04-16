import React, { useEffect, useState } from 'react'
import './Main.css'
import { BodyParser } from '../NewPost/controllers';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { CiCircleChevDown } from "react-icons/ci";

function Main() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { query } = useOutletContext();

  async function getData() {
    try {
      setLoading(true);
      let response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/all-posts`)
      response = await response.json()
      setPosts(response)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData();
  }, [])
  
  function checkPostData(post) {
    if (!query) {
      return true
    }
    const searchTerm = query.toLowerCase().trim();
    const isTitleMatch = post.title.toLowerCase().includes(searchTerm);
    const isTechnologyMatch = post.technologies
      .some(tech => tech.toLowerCase().trim().includes(searchTerm));
    return isTitleMatch || isTechnologyMatch;
  }

  const filteredPosts = posts.filter(post => checkPostData(post));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    )
  }

  return (
    <div className='main-body'>
      {filteredPosts.length === 0 ? (
        <div className="no-results">
          <h3>No posts found matching "{query}"</h3>
          <p>Try searching with different keywords or browse all posts</p>
        </div>
      ) : (
        filteredPosts.map((post, idx) => (
          <div className='main-body-child' key={idx}>
            <div className="post-image-container">
              {post.bannerImage && <img src={post.bannerImage} alt={post.title} />}
            </div>
            <div className="post-content">
              <h2 
                className='post-title'
                onClick={() => { navigate('/post', { state: { post } }) }}
              >
                {post.title}
              </h2>
              
              <div className="post-excerpt">
                <BodyParser post={post.body} />
              </div>
              
              <div className='tags-parser'>
                {post.technologies.map((tag, tagIdx) => (
                  <span key={tagIdx} className='main-tech-tag-parser'>{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="card-footer">
              <button 
                className='see-more-tag'
                onClick={() => { navigate('/post', { state: { post } }) }}
              >
                Read more
                <CiCircleChevDown className='see-more-tag-arrow' />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Main