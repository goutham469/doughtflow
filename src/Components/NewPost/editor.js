import { useState } from "react"
import { MdPadding } from "react-icons/md";
import { addImage } from "./controllers";

async function addVideo(event)
{
    let videoFile = event.target.files[0]
    if(videoFile)
    {
        let formData = new FormData();
        formData.append("video",videoFile)
        try
        {
            // console.log("started to fetch server to upload video");
            alert("video upload started , do not refresh !")
            
            let base_url = process.env.REACT_APP_SERVER_BASE_URL
            let response = await fetch(`${base_url}/media/uploadPostVideo`,{
                method:"POST",
                body:formData
            })
            console.log("fetching server completed");
            
            let data = await response.json()
            console.log(data)

            if(data.status == true)
            {
                alert("video uploaded successfully")
                return data.file.path;
            }
            else
            {
                alert("video upload failed");
            }
        }
        catch(err)
        {
            console.log(err)
            alert(err)
        }
    }
    return
}

export function Editor({sendDataToParent,currentState})
{
    const [data,setData] = useState({})
    const [image_url_upload_link,set_image_url_upload_link] = useState()

    function handleClick(event)
    {
        event.preventDefault();
        if(data)
        {
            if(data.type)
            {
                sendDataToParent(data);
                setData({})
            }
            setData({})
        }
        setData({})
    }
    function image_url_upload(event)
    {
        event.preventDefault();
        if(image_url_upload_link)
        {
            sendDataToParent({ type:'img' , value:image_url_upload_link })
        }else{
            
        }
    }
    const styles={
        list:{height:"200px",width:"300px",MdPadding,padding:"10px"}
    }
    return <div>
            {
                currentState == 0 ?
                <b>choose any one Options below to start Editing.</b>
                :
                currentState == 'code' ?
                <div>
                    <b>paste the code , in below textbox</b><br/>
                    <textarea 
                    style={styles.list}
                    onChange={(event)=>{setData(prevData=>({...prevData , type:'code' , value:event.target.value}))}}
                    /><br/>
                    <button onClick={(event)=>{handleClick(event)}}>SAVE</button>
                </div>
                :
                currentState == 'p' ?
                <div>
                    <b>Enter the paragraph content below.</b><br/>
                    <textarea 
                    style={styles.list}
                    onChange={(event)=>{setData(prevData=>({...prevData , type:'p' , value:event.target.value}))}}
                    /><br/>
                    <button onClick={(event)=>{handleClick(event)}}>SAVE</button>
                </div>
                :
                currentState == 'b' ?
                <div>
                    <b>Enter the heading content below.</b><br/>
                    <textarea onChange={(event)=>{setData(prevData=>({...prevData , type:'b' , value:event.target.value}))}}/><br/>
                    <button onClick={(event)=>{handleClick(event)}}>SAVE</button>
                </div>
                :
                currentState == 'img' ?
                <div>
                    <b>Choose a Image file from below</b><br/>
                    <input 
                    type='file' 
                    accept='image/*' 
                    onChange={async (event)=>{
                        let image_url = await addImage(event)
                        setData(prevData=>({...prevData , type:'img' , value:image_url}))
                        sendDataToParent({ type:'img' , value:image_url })
                    }}/>
                    <br/>
                    <label>or</label>
                    <br/>
                    <input
                     type="text"
                     placeholder="or paste a link here"
                     onChange={(event)=>{set_image_url_upload_link(event.target.value)}}
                    />
                    <button onClick={(event)=>{image_url_upload(event)}}>Upload</button>
                </div>
                :
                currentState == 'video' ?
                <div>
                    <b>Choose a Video file from below</b><br/>
                    <input 
                    type='file' 
                    accept='video/*' 
                    onChange={async (event)=>{
                        let video_url = await addVideo(event)
                        setData(prevData=>({...prevData , type:'video' , value:video_url}))
                        sendDataToParent({ type:'video' , value:video_url })
                    }}/>
                </div>
                :
                currentState == 'link' ?
                <div>
                    <b>Enter the link name , link address</b><br/>
                    <input 
                    placeholder="link name"
                    onChange={(event)=>{setData(prevData=>({...prevData , type:'link' , name:event.target.value}))}}
                    /><br/>
                    <input 
                    placeholder="link address"
                    onChange={(event)=>{setData(prevData=>({...prevData , type:'link' , ref:event.target.value}))}}
                    /><br/>
                    <button onClick={(event)=>{handleClick(event)}}>SAVE</button>
                </div>
                :
                currentState == 'ol' ?
                <div>
                     <b>Enter ordered list , seperated by <b>ENTER(\n)</b>   </b><br/>
                     <textarea 
                     onChange={(event)=>{setData(prevData=>({...prevData , type:'ol' , value:event.target.value.split('\n')}))}}
                     style={styles.list}
                     /><br/>
                     <button onClick={(event)=>{handleClick(event)}}>SAVE</button>
                </div>
                :
                currentState == 'ul' ?
                <div>
                     <b>Enter ordered list , seperated by <b>ENTER(\n)</b>  </b><br/>
                     <textarea 
                     onChange={(event)=>{setData(prevData=>({...prevData , type:'ul' , value:event.target.value.split('\n')}))}}
                     style={styles.list}
                     /><br/>
                     <button onClick={(event)=>{handleClick(event)}}>SAVE</button>
                </div>
                :
                <></>
            }
            </div>
}