import './NewPost.css'
import { useState } from 'react';
import { FaCode } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { CiCircleList } from "react-icons/ci";
import { FaListOl } from "react-icons/fa6";
import { IoCopyOutline } from "react-icons/io5";
import Notification from '../../Utils/ProgressBar';

export function BodyParser({post:post})
{
    const [notification, setNotification] = useState(null);
    
    return <div>
            {
                post.map((item,idx)=><div className='body-parser'>
                    {
                        item.type == 'p' ?
                        <p>{item.value}</p>
                        :
                        item.type == 'b' ?
                        <div>
                            <b>{item.value}</b>
                            <br/>
                        </div>
                        :
                        item.type == 'img' ?
                        <div>
                            <center>
                                <img 
                                src={item.value} 
                                className='new-post-image'
                                width="300px"
                                />
                            </center>
                            <br/>
                        </div>
                        :
                        item.type == 'video' ?
                        <div>
                            <video 
                            style={{borderRadius:"20px",border:"2px solid blue"}} 
                            src={item.value} 
                            width="400px" 
                            height="300px" 
                            controls loop 
                            controlsList='nodownload'
                            />
                            <br/>
                        </div>
                        :
                        item.type == 'link' ?
                        <div>
                            <a href={`${item.ref}`} target='_blank'>{item.name}</a>
                            <br/>
                        </div>
                        :
                        item.type == 'ol' ?
                        <div>
                            <ol>
                                {
                                    item.value.map(listItem=><li>{listItem}</li>)
                                }
                            </ol>
                            <br/>
                        </div>
                        :
                        item.type == 'ul' ?
                        <div>
                            <ul>
                                {
                                    item.value.map(listItem=><li>{listItem}</li>)
                                }
                            </ul>
                            <br/>
                        </div>
                        :
                        item.type == 'code' ?
                        <div>
                            <pre style={{backgroundColor:"black",borderRadius:"10px",padding:"10px",overflowX:"scroll",color:"white",position:"relative"}}>
                                <code>
                                    <button 
                                    className="copy-code-button" 
                                    onClick={()=>{
                                        navigator.clipboard.writeText(item.value);
                                        setNotification({ message: 'Code copied to clipboard', color: 'green' });
                                            }}
                                    ><IoCopyOutline /> Copy</button>
                                    {item.value}
                                </code>
                            </pre>
                        </div>
                        :
                        <b>not supported</b>
                    }
                </div>)
            }
            {
            notification && (
                <Notification 
                    message={notification.message} 
                    color={notification.color}
                    onClose={() => setNotification(null)} 
                />
            )}
            </div>
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