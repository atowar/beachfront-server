const express = require('express');
const {MongoClient} = require('mongodb');
require('dotenv').config();

const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dbo7u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);
async function run () {
    try{
        //database connection
        await client.connect();
        const database = client.db('beachfront');
        const serviceCollection = database.collection('services');
        const bookingCollection = database.collection('booking');

        //get services API

        app.get('/services', async(req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
        //get booked services API

        app.get('/booked-services', async(req, res) => {
            const cursor = bookingCollection.find({});
            const bookedServices = await cursor.toArray();
            res.send(bookedServices)
        })
        //get single service API
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.json(service)
        });

        //add booking API

        app.post('/booking', async(req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result)
        })
    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('BeachFront server running')
})

app.listen(port, ()=>{
    console.log('PORT: ', port);
})

