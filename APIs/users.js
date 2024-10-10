const exp = require('express')
const usersAPI = exp.Router()

usersAPI.get('/',(req,res)=>{
    res.send("users API")
})

usersAPI.post('/login' , async (req,res)=>{
     let response = await req.usersCollection.find({email:req.body.email}).toArray()
     if(response.length > 0)
     {
        res.send({"message":"login success"})
     }
     else
     {
        response = await req.usersCollection.insertOne({"email":req.body.email,"img":req.body.img})
        res.send(response)
     }
})

module.exports = usersAPI;