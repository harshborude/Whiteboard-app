const mongoose = require('mongoose');
const dns = require('node:dns'); // Add this line
require('dotenv').config();

const url = process.env.MONGO_URI;

// Force Node.js to use Cloudflare and Google public DNS servers
dns.setServers(['1.1.1.1', '8.8.8.8']); 

const connectToDatabase = async () => {
    try {
        await mongoose.connect(url);
        console.log('Connected to the database');
    } catch (err) {
        console.error(`Error connecting to the database: ${err}`);
    }
};

module.exports = connectToDatabase;