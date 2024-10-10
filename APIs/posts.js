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
    let response = await req.postsCollection.find().toArray()
    res.send(response)
})

module.exports = postsAPI;