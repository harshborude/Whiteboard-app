const Canvas = require('../models/canvasModel');


const getAllCanvas = async (req, res) =>{
    const email = req.email;

    try{
        const canvases = await Canvas.getAllCanvas(email);
        res.status(200).json(canvases);
    }
    catch(err){
        res.status(400).json({message : err.message})
    }

};

//create new canvas for a user
const createCanvas = async(req,res) =>{
    const email = req.email;
    const {name} = req.body;

    try{
        const newCanvas = await Canvas.createCanvas(email, name);
        res.status(201).json(newCanvas);
        console.log('Created new canvas');
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
}

const loadCanvas = async(req,res)=>{
    const email = req.email;
    const id = req.params.id;
    try{
            const canvas = await Canvas.loadCanvas(email, id);
            if (!canvas) {
                return res.status(404).json({message: "Canvas not found or unauthorized"});
            }
            res.status(200).json(canvas);
    }
    catch(err){
            res.status(400).json({message : err.message});
    }
}
const updateCanvas = async (req, res) => {
  const email = req.email;
  const id = req.params.id;
  const { elements } = req.body;

  try {
    const canvas = await Canvas.updateCanvas(email, id, elements);
    res.status(200).json(canvas);
  } catch (error) {
    console.error('Error updating canvas:', error.message);
    res.status(500).json({ message: error.message || 'Failed to update canvas' });
  }
};


const deleteCanvas = async (req, res) => {
  const email = req.email;
  const id = req.params.id;

  try {
    await Canvas.deleteCanvas(email, id);
    res.status(200).json({ message: 'Canvas deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete canvas' });
  }
};

const shareCanvas = async (req, res) => {
  const email = req.email;
  const id = req.params.id;
  const { targetEmail } = req.body;

  try {
    if (!targetEmail) {
      return res.status(400).json({ message: 'Target email is required' });
    }
    const canvas = await Canvas.sendShareRequest(email, id, targetEmail);
    res.status(200).json({ message: 'Share request sent successfully', canvas });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to send share request' });
  }
};

const getIncomingRequests = async (req, res) => {
  const email = req.email;
  try {
    const requests = await Canvas.getIncomingRequests(email);
    res.status(200).json(requests);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to fetch requests' });
  }
};

const acceptShareRequest = async (req, res) => {
  const email = req.email;
  const id = req.params.id;
  try {
    const canvas = await Canvas.acceptRequest(email, id);
    res.status(200).json({ message: 'Request accepted successfully', canvas });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to accept request' });
  }
};

const rejectShareRequest = async (req, res) => {
  const email = req.email;
  const id = req.params.id;
  try {
    const canvas = await Canvas.rejectRequest(email, id);
    res.status(200).json({ message: 'Request rejected successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to reject request' });
  }
};

module.exports = {
    getAllCanvas,
    createCanvas,
    loadCanvas,
    updateCanvas,
    deleteCanvas,
    shareCanvas,
    getIncomingRequests,
    acceptShareRequest,
    rejectShareRequest
};