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
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
}

module.exports = {
    getAllCanvas,
    createCanvas
}