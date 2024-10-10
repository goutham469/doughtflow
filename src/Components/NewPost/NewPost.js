import React, { useEffect, useState } from 'react'
import './NewPost.css'
import { BodyParser,addImage,ToolBar, send_post } from './controllers'
import { Editor } from './editor'
import Notification from '../../Utils/ProgressBar'
import { useNavigate } from 'react-router-dom'

function NewPost() {
    const [post,setPost] = useState({
        stage:0,
        title:'',
        bannerImage:'',
        body:[],
        technologies:[],
        author:''
    })
    const [bodyChoose , setBodyChoose] = useState(0)
    const [state,setState] = useState(0)
    // notification bar
    const [notification, setNotification] = useState(null);

    const navigate = useNavigate()

    async function upload_image(event)
    {
        let data = await addImage(event)
        setPost(prevData=>({...prevData , bannerImage:data}))
    }
    function setBodyChange(data)
    {
        console.log(data)
        setBodyChoose(0);
        setPost(prevData=>({...prevData , body : [...prevData.body , data]}))
    }
    const style={
        button:{backgroundColor:"green",border:"none",borderRadius:"5px",padding:"5px",margin:"10px",cursor:"pointer",color:"white",fontWeight:"500"}
    }

    useEffect(()=>{
        if(!localStorage.getItem('email'))
        {
            setNotification({ message: 'access denied', color: 'red' });
            navigate('/login')
        }
    },[])

  return (
    <div>
        <h3>New Post</h3>
        <div className='main-tab'>
            <div className='output-console'>
                <b>Your POST</b><br/><br/>
                <img src={post.bannerImage} className='new-post-bannerImage'/><br/>
                <b className='new-post-title'>{post.title}</b>
                <BodyParser post={post.body}/>
            </div>
            <div className='editor'>
                <b>Editor</b><br/><br/>
                {
                    state == 0 ?
                    <div>
                        <b>Add a Title</b><br/>
                        <textarea style={{width:"300px",height:"100px",fontSize:"20px"}} onChange={(event)=>setPost(prevData=>({...prevData, title:event.target.value}))}/>
                        
                        <br/><br/>
                        <b>Upload a Banner Image</b><br/>
                        <input type='file' accept='image/*' onChange={(event)=>upload_image(event)}/>
                        <br/>
                        <label>or</label>
                        <br/>
                        <input placeholder='paste a link here' onChange={(event)=>{setPost(prevData=>({...prevData , bannerImage:event.target.value}))}}/>

                        <br/>
                        <button style={style.button} onClick={(event)=>setState(1)}>Next</button>
                    </div>
                    :
                    <div className='choose-body-items'>
                        <Editor sendDataToParent={setBodyChange} currentState={bodyChoose}/>
                        <ToolBar sendDataToParent={setBodyChoose}/>
                        <button style={style.button} onClick={(event)=>setState(0)}>Prev</button>
                        <button style={style.button} onClick={
                            async (event)=>{
                                event.preventDefault()
                                let output = await send_post(post)
                                console.log(output)

                                if(output.acknowledged)
                                {
                                    setNotification({ message: 'Post published', color: 'green' });
                                    setTimeout(()=>{
                                        navigate('/')
                                    },4000)
                                }
                                else
                                {
                                    setNotification({ message: 'some problem occured', color: 'yellow' });
                                }
                                }
                            }>SUBMIT</button>
                    </div>
                }
            </div>
        </div>
        {notification && (
            <Notification 
                message={notification.message} 
                color={notification.color}
                onClose={() => setNotification(null)} 
            />
        )}
    </div>
  )
}

export default NewPost