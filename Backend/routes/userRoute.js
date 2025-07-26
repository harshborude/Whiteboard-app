const express = require('express')
const router = express.Router();
const {registerUser, loginUser, getUserProfile} = require('../controllers/userController');
const protectRoute = require('../middlewares/protectedRoute');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile',protectRoute, getUserProfile);
module.exports = router;