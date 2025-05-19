const exp = require('express')
const postsAPI = exp.Router()

postsAPI.get('/',(req,res)=>{
    res.send("posts API")
})

postsAPI.post('/new-post',async (req,res)=>{
    let response = await req.postsCollection.insertOne(req.body);

    res.send(response)
})
postsAPI.get('/all-posts',async(req,res)=>{
    console.log("\n\nall posts called .\n\n")

    try
    {
        if(!req.postsCollection)
        {
            let response = await req.app.get('postsCollection').find().toArray()
            // console.log(response[0])
            res.send(response)
        }
        else
        {
            let response = await req.postsCollection.find().toArray()
            // console.log(response[0])
            res.send(response)
        }
        
    }
    catch(err)
    {
        console.log(err)
        res.send({message:"an error occured.",success:false,error:true,errorMessage:err.message})
    }
})
postsAPI.get("/post", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");
    
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing id in query" });

    const postObject = await req.postsCollection.findOne({ _id: new ObjectId(id) });

    if (!postObject) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(postObject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = postsAPI;