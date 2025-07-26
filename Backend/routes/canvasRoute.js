const express = require('express');
const {getAllCanvas, createCanvas} = require('../controllers/canavsController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth , getAllCanvas);
router.post('/', auth, createCanvas);
module.exports = router;