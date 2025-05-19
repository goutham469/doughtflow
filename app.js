const exp = require('express');
const app = exp();

const serverless = require('serverless-http');
const cors = require('cors');
const compression = require('compression')
require('dotenv').config();
const { MongoClient } = require('mongodb');

const DBAccess = require('./Middlewares/DBAccess');
const APICounter = require('./Middlewares/APICounter');
const WebSiteCounter = require('./Middlewares/WebSiteCounter');
const usersAPI = require('./APIs/users');
const ErrorRoutehandler = require('./Middlewares/ErrorRoutehandler');
const postsAPI = require('./APIs/posts');
const mediaAPI = require('./APIs/media');

app.use(exp.json());
app.use(exp.urlencoded({ extended: true }));
app.use(cors());

console.log(process.env.MONGO_DB_URL);

// Global variable to store MongoDB connection status
let isMongoConnected = false;

// MongoDB setup
let mongoClientPromise = MongoClient.connect(process.env.MONGO_DB_URL)
    .then(client => {
        const DB = client.db('doughtflow');
        const usersCollection = DB.collection('users');
        const postsCollection = DB.collection('posts');
        const metaCollection = DB.collection('meta');

        app.set('usersCollection', usersCollection);
        app.set('postsCollection', postsCollection);
        app.set('metaCollection', metaCollection);

        isMongoConnected = true;
        console.log("MongoDB connection successful");
    })
    .catch(err => {
        console.error("MongoDB connection failed:", err);
        process.exit(1); // Exit process on failure
    });

// Middleware to wait for MongoDB connection
app.use(async (req, res, next) => {
    if (!isMongoConnected) {
        try {
            await mongoClientPromise; // Wait for the MongoDB connection
            next(); // Proceed if connected
        } catch (err) {
            return res.status(500).send({ message: "MongoDB not connected yet" });
        }
    } else {
        next();
    }
});

// Middleware for database access
app.use(DBAccess);
app.use(APICounter);
app.use(compression())

// Routes
app.get('/', (req, res) => {
    res.send("<h1>Dought Flow</h1>");
});

app.get('/client', WebSiteCounter, async (req, res) => {
    try {
        let response = await req.metaCollection.find().toArray();
        res.send(response[0]);
    } catch (err) {
        res.status(500).send({ error: "Failed to fetch meta data" });
    }
});

app.get('/meta', async (req, res) => {
    try {
        let response = await req.metaCollection.find().toArray();
        res.send(response[0]);
    } catch (err) {
        res.status(500).send({ error: "Failed to fetch meta data" });
    }
});

// Routes management
app.use('/users', usersAPI);
app.use('/posts', postsAPI);
app.use('/media', mediaAPI);





app.use('*', ErrorRoutehandler);

// Export serverless handler
module.exports.handler = serverless(app);

// app.listen( 4000 , ()=>console.log("server running on PORT 4000 ..."))
