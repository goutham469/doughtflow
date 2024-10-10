const exp = require('express')
const mediaAPI = exp.Router()

var cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:true
  });

const postsImagecloudinaryStorage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:async (req,file)=>{
        return {
            folder:process.env.CLOUDINARY_FOLDER_SOCIAL_POSTS_IMAGES,
            public_id:Date.now()
        }
    }
})

const videoCloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: process.env.CLOUDINARY_FOLDER_SOCIAL_POSTS_VIDEOS, // Ensure this folder exists in your environment variables
        resource_type: 'video',
        public_id: Date.now().toString()
      };
    }
  });

var Postupload = multer({storage:postsImagecloudinaryStorage})
var videoUpload = multer({ storage: videoCloudinaryStorage });

mediaAPI.post('/uploadPostImage',Postupload.single("photo"),async (req,res)=>{

    console.log(req.body)

    console.log(req.file);
    res.send({"status":true,"file":req.file})
})


mediaAPI.post('/uploadPostVideo', videoUpload.single("video"), async (req, res) => {
    console.log("Video POST request received");
  
    if (!req.file) {
      return res.status(400).send({ status: false, error: 'No file uploaded' });
    }
  
    console.log("File to be uploaded:", req.file);
  
    res.send({ status: true, file: req.file });
  });

mediaAPI.get('/',(req,res)=>{
    res.send("Media API speaking !")
})

module.exports = mediaAPI