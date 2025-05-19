import React, { useState, useEffect } from 'react';
import { Calendar, User, Tag, ChevronLeft } from 'lucide-react';

function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPostData() {
      try {
        // Get the id from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        if (!postId) {
          throw new Error('Post ID not found in URL');
        }

        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/post?id=${postId}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching post: ${response.status}`);
        }
        
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    fetchPostData();
  }, []);

  const renderContent = (bodyItem, index) => {
    switch (bodyItem.type) {
      case 'p':
        return (
          <p key={index} style={{
            fontSize: '12px',
            lineHeight: '1.7',
            color: '#444',
            margin: '0 0 16px 0'
          }}>
            {bodyItem.value}
          </p>
        );
      
      case 'b':
        return (
          <h3 key={index} style={{
            fontSize: '22px',
            fontWeight: '600',
            color: '#222',
            margin: '24px 0 16px 0'
          }}>
            {bodyItem.value}
          </h3>
        );
      
      case 'ol':
        return (
          <ol key={index} style={{
            paddingLeft: '20px',
            margin: '0 0 20px 0',
            backgroundColor:"#EAEAEA"
          }}>
            {bodyItem.value.map((item, i) => (
              <li key={i} style={{
                fontSize: '12px',
                lineHeight: '1.7',
                color: '#444',
                margin: '8px 0'
              }}>
                {item}
              </li>
            ))}
          </ol>
        );
      
      case 'ul':
        return (
          <ul key={index} style={{
            paddingLeft: '20px',
            margin: '0 0 20px 0',
            listStyleType: 'disc',
            backgroundColor:"#EAEAEA"
          }}>
            {bodyItem.value.map((item, i) => (
              <li key={i} style={{
                fontSize: '12px',
                lineHeight: '1.7',
                color: '#444',
                margin: '8px 0'
              }}>
                {item}
              </li>
            ))}
          </ul>
        );
      
      case 'code':
        return (
          <pre key={index} style={{
            backgroundColor: '#f6f8fa',
            borderRadius: '6px',
            padding: '16px',
            overflowX: 'auto',
            margin: '0 0 20px 0',
            border: '1px solid #e1e4e8',
            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: '14px',
            lineHeight: '1.45',
            color: '#333'
          }}>
            <code>
              {bodyItem.value}
            </code>
          </pre>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ fontSize: '16px', color: '#666' }}>Loading post...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        backgroundColor: '#fff5f5',
        border: '1px solid #feb2b2',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#c53030', marginBottom: '10px' }}>Error</h2>
        <p style={{ color: '#c53030' }}>{error}</p>
        <button 
          onClick={() => window.history.back()}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            backgroundColor: '#edf2f7',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '20px auto 0'
          }}
        >
          <ChevronLeft size={16} />
          Go Back
        </button>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 20px',
      backgroundColor: '#fff',
      color: '#333',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Back button */}
      <button 
        onClick={() => "/"}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#3182ce',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '0',
          marginBottom: '24px'
        }}
      >
        <ChevronLeft size={18} />
        <span>Back to posts</span>
      </button>
      
      {/* Banner image */}
      {post.bannerImage && (
        <div style={{
          width: '100%',
          height: '300px',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f7fafc'
        }}>
          <img 
            src={post.bannerImage} 
            alt={post.title} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}
      
      {/* Title */}
      <h1 style={{
        fontSize: '32px',
        fontWeight: '700',
        color: '#1a202c',
        marginBottom: '16px',
        lineHeight: '1.2'
      }}>
        {post.title}
      </h1>
      
      {/* Metadata */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px',
        fontSize: '14px',
        color: '#718096'
      }}>
        {post.author && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <User size={16} />
            <span>{post.author}</span>
          </div>
        )}
        
        {post._id && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Tag size={16} />
            <span>ID: {post._id.substring(0, 8)}...</span>
          </div>
        )}
      </div>
      
      {/* Content separator */}
      <div style={{
        height: '1px',
        backgroundColor: '#e2e8f0',
        margin: '0 0 32px 0'
      }}></div>
      
      {/* Main content */}
      <div style={{
        fontSize: '12px',
        lineHeight: '1.7',
        textAlign:"left"
      }}>
        {post.body && post.body.map((item, index) => renderContent(item, index))}
      </div>
      
      {/* Tags */}
      {post.technologies && post.technologies.length > 0 && (
        <div style={{
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px'
          }}>
            Technologies
          </h3>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {post.technologies.map((tech, index) => (
              <span key={index} style={{
                backgroundColor: '#ebf4ff',
                color: '#4299e1',
                borderRadius: '16px',
                padding: '4px 12px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;