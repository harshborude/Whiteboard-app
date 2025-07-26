const mongoose = require('mongoose');
require('dotenv').config(); // Load .env variables

const url = process.env.MONGO_URI;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(url);
        console.log('Connected to the database');
    } catch (err) {
        console.error(`Error connecting to the database: ${err}`);
    }
};

module.exports = connectToDatabase;
