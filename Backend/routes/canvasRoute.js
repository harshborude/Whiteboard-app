const express = require('express');
const {getAllCanvas, createCanvas, loadCanvas, updateCanvas} = require('../controllers/canavsController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth , getAllCanvas);
router.post('/', auth, createCanvas);
router.get('/load/:id', auth, loadCanvas);
router.put('/:id', auth, updateCanvas);
module.exports = router;