const express = require('express');
require('dotenv').config(); // Load environment variables


const app = express();
const userRoute = require('./routes/userRoute');
const cors = require('cors');
const connectToDatabase = require('./db');

const canvasRoute = require('./routes/canvasRoute');
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.listen( PORT , () =>{
    console.log(`server running on port ${PORT}`)
})

connectToDatabase();

app.use('/user', userRoute);
app.use('/canvas', canvasRoute);
