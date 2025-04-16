import './NewPost.css'
import { useState } from 'react';
import { FaCode } from "react-icons/fa";
import { FaLink,FaCheck } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { CiCircleList } from "react-icons/ci";
import { FaListOl } from "react-icons/fa6";
import { IoCopyOutline } from "react-icons/io5";
import Notification from '../../Utils/ProgressBar';

import { useEffect } from 'react';

export function BodyParser({ post }) {
    const [notification, setNotification] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);
    
    // Reset copied state after 2 seconds
    useEffect(() => {
      if (copiedIndex !== null) {
        const timer = setTimeout(() => {
          setCopiedIndex(null);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [copiedIndex]);
  
    // Simple code language detection (can be expanded)
    const detectLanguage = (code) => {
      if (code.includes('import React') || code.includes('function(') || code.includes('const ') || code.includes('let ') || code.includes('var '))
        return 'javascript';
      if (code.includes('<html') || code.includes('<!DOCTYPE') || code.includes('<div'))
        return 'html';
      if (code.includes('.class') || code.includes('margin:') || code.includes('padding:'))
        return 'css';
      if (code.includes('def ') || code.includes('import ') && code.includes(':'))
        return 'python';
      return 'code';
    };
  
    const handleCopyCode = (value, idx) => {
      navigator.clipboard.writeText(value);
      setCopiedIndex(idx);
      setNotification({ message: 'Code copied to clipboard', color: 'green' });
    };
  
    return (
      <div className="body-parser-container">
        {post.map((item, idx) => (
          <div className='body-parser' key={idx}>
            {item.type === 'p' ? (
              <div className="paragraph">
                {item.value.split('\n').map((para, paraIdx) => (
                  <p key={paraIdx}>{para}</p>
                ))}
              </div>
            ) : item.type === 'b' ? (
              <div className="bold-text">
                <b>{item.value}</b>
                <br />
              </div>
            ) : item.type === 'img' ? (
              <div className="image-container">
                <img
                  src={item.value}
                  className='new-post-image'
                  alt="Post content"
                  loading="lazy"
                />
                <br />
              </div>
            ) : item.type === 'video' ? (
              <div className="video-container">
                <video
                  className="content-video"
                  src={item.value}
                  controls
                  loop
                  controlsList='nodownload'
                />
                <br />
              </div>
            ) : item.type === 'link' ? (
              <div className="link-container">
                <a href={item.ref} target='_blank' rel="noopener noreferrer" className="content-link">
                  {item.name}
                </a>
                <br />
              </div>
            ) : item.type === 'ol' ? (
              <div className="ordered-list">
                <ol>
                  {item.value.map((listItem, listIdx) => (
                    <li key={listIdx}>{listItem}</li>
                  ))}
                </ol>
                <br />
              </div>
            ) : item.type === 'ul' ? (
              <div className="unordered-list">
                <ul>
                  {item.value.map((listItem, listIdx) => (
                    <li key={listIdx}>{listItem}</li>
                  ))}
                </ul>
                <br />
              </div>
            ) : item.type === 'code' ? (
              <div className="code-block-container">
                <div className="code-header">
                  <span className="code-language">{detectLanguage(item.value)}</span>
                  <button
                    className={`copy-code-button ${copiedIndex === idx ? 'copied' : ''}`}
                    onClick={() => handleCopyCode(item.value, idx)}
                    aria-label="Copy code"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <FaCheck className="copy-icon" /> Copied!
                      </>
                    ) : (
                      <>
                        <IoCopyOutline className="copy-icon" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="code-block">
                  <code>{item.value}</code>
                </pre>
              </div>
            ) : (
              <div className="unsupported-content">
                <b>Content type not supported</b>
              </div>
            )}
          </div>
        ))}
        {notification && (
          <Notification
            message={notification.message}
            color={notification.color}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    );
  }

export async function addImage(event)
{
    let ImageFile = event.target.files[0];
    if(ImageFile)
    {
        let formData = new FormData();
        formData.append("photo",ImageFile);

        try
        {
            alert("image upload started , do not refresh !")
            let base_url = process.env.REACT_APP_SERVER_BASE_URL;
            const response = await fetch(`${base_url}/media/uploadPostImage`,{
                method:'POST',
                body:formData
            });

            const data = await response.json();
            console.log(data)

            if(response.ok)
            {
                console.log(data.file.path);
                alert('image uploaded successfully')

                return data.file.path
            }
            else
            {
                alert('image upload failed')
                return
            }
        }
        catch(err)
        {
            alert(err)
        }
    }
}



export function ToolBar({sendDataToParent})
{
    const style={
        button:{border:"1px solid black",borderRadius:"3px",padding:"2px",margin:"5px",cursor:"pointer"},
        icon:{margin:"5px",cursor:"pointer"},
        main:{backgroundColor:"yellow",width:"fit-content",padding:"10px",borderRadius:"5px",margin:"10px",color:"black"}
        }
    function handleChange(value)
    {
        sendDataToParent(value)
    }
    return <div style={style.main}>
                <FaCode style={style.icon} onClick={()=>handleChange('code')} />
                <b style={style.button} onClick={()=>handleChange('p')} >Paragraph</b>
                <b style={style.button} onClick={()=>handleChange('b')} >heading</b>
                <FaLink style={style.icon} onClick={()=>handleChange('link')} />
                <FaImage style={style.icon} onClick={()=>handleChange('img')} />
                <FaVideo style={style.icon} onClick={()=>handleChange('video')}  />
                <CiCircleList style={style.icon} onClick={()=>handleChange('ul')} />
                <FaListOl style={style.icon}  onClick={()=>handleChange('ol')} />
            </div>
}

export async function send_post(post)
{
    post.author = localStorage.getItem('email')
    console.log(post)
    let response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/new-post`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(post)
    })
    response = await response.json()
    console.log(response)

    return response;
}