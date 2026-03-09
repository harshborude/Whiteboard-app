const express = require('express');
const {getAllCanvas, createCanvas, loadCanvas, updateCanvas, deleteCanvas, shareCanvas, getIncomingRequests, acceptShareRequest, rejectShareRequest} = require('../controllers/canvasController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth , getAllCanvas);
router.post('/', auth, createCanvas);
router.get('/requests', auth, getIncomingRequests);
router.post('/share/:id', auth, shareCanvas);
router.post('/accept/:id', auth, acceptShareRequest);
router.post('/reject/:id', auth, rejectShareRequest);

router.get('/load/:id', auth, loadCanvas);
router.put('/:id', auth, updateCanvas);
router.delete('/:id', auth, deleteCanvas); 
module.exports = router;