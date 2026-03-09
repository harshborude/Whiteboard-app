const express = require('express');
const {getAllCanvas, createCanvas, loadCanvas, updateCanvas, deleteCanvas} = require('../controllers/canvasController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth , getAllCanvas);
router.post('/', auth, createCanvas);
router.get('/load/:id', auth, loadCanvas);
router.put('/:id', auth, updateCanvas);
router.delete('/:id', auth, deleteCanvas); // Add this route
module.exports = router;