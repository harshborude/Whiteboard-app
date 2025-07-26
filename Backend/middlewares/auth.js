const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // cleaner than replace
    const decoded = jwt.verify(token, JWT_SECRET);

    req.email = decoded.email; // make sure token was signed with { email }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;
