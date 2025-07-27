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



module.exports = {
    getAllCanvas,
    createCanvas,
    loadCanvas,
    updateCanvas
}