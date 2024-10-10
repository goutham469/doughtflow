const exp = require('express')
const app = exp()

const cors = require('cors')
require('dotenv').config()
const mclient = require('mongodb').MongoClient

const DBAccess = require('./Middlewares/DBAccess')
const APICounter = require('./Middlewares/APICounter')
const WebSiteCounter = require('./Middlewares/WebSiteCounter')
const usersAPI = require('./APIs/users')
const ErrorRoutehandler = require('./Middlewares/ErrorRoutehandler')
const postsAPI = require('./APIs/posts')
const mediaAPI = require('./APIs/media')


app.use(exp.json()) // to read req data
app.use(cors())

// mongoDB setup
console.log(process.env.MONGO_DB_URL)

mclient.connect(process.env.MONGO_DB_URL).then(client=>{
    const DB = client.db('doughtflow')

    const usersCollection = DB.collection('users')
    const postsCollection = DB.collection('posts')
    const metaCollection = DB.collection('meta')

    app.set('usersCollection' , usersCollection)
    app.set('postsCollection' , postsCollection)
    app.set('metaCollection' , metaCollection)

    console.log("mongoDB connection successful")
})

app.use(DBAccess)
app.use(APICounter)


// routes
app.get('/',(req,res)=>{
    res.send("<h1>Dought Flow</h1>")
})

app.get('/client',WebSiteCounter,async (req,res)=>{
    let response = await req.metaCollection.find().toArray()
    res.send(response[0])
})

app.get('/meta',async (req,res)=>{
    let response = await req.metaCollection.find().toArray()
    res.send(response[0])
})

// routes management
app.use('/users' , usersAPI)
app.use('/posts' , postsAPI)
app.use('/media' , mediaAPI)
app.use('*',ErrorRoutehandler)

// PORT assignment
app.listen(4000,()=>{console.log("Dought Flow , server running on PORT 4000 !")})