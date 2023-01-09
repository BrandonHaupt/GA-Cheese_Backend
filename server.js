// installing Cors allows us to deploy our frontend React app onto netlify.com and communicate with our database that's deployed on render.com

// IMPORTS
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const morgan = require('morgan')

// This is just saying if no port is declared it will automatically select 3000 or saying const PORT = process.env.PORT || 3000
const { PORT = 3000, DATABASE_URL } = process.env // This is destructured 

const app = express();

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true, 
    useNewUrlParser: true
});

mongoose.connection
.on("open", () => console.log('You are connnectd to mongoose'))
.on("close", () => console.log('You are disconnected from mongoose'))
.on("error", (error) => console.log(error))

const CheeseSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})

const Cheese = mongoose.model('Cheese', CheeseSchema)

// MIDDLEWARE SECTION
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())


// ROUTE SECTION
app.get('/', (req,res) => {
    res.send('Cheese baby!')
})

app.get('/cheese', async (req, res) => {
    try{
        res.json(await Cheese.find({}))
    }catch(error){
        res.status(400).json(error)
    }
})

// CREATE
app.post('/cheese', async (req,res) => {
    try {
        res.json(await Cheese.create(req.body))
    }catch (error) {
        res.status(400).json(error)
    }
})

// UPDATE
app.put('/cheese/:id', async (req, res) => {
    try {
        res.json( await Cheese.findByIdAndUpdate(req.params.id, req.body, {new:true}))
    }catch (error) {
        res.status(400).json(error)
    }
})

// DELETE
app.delete('/cheese/:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

// 
app.get('/cheese/:id', async (req, res) => {
    try {
        res.json(await Cheese.findById(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})




app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})