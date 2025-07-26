const mongoose = require('mongoose');

const canvasSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    elements: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    shared_with: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  
    // last_modified_by: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    // },
  },
  {
    timestamps: true,
  }
);


//Get all canvas for a user (boh ownder and shared with)

canvasSchema.statics.getAllCanvas = async function (email) {
  const User = mongoose.model('User');
  const user = await User.findOne({ email });

  if (!user) throw new Error('User not found');

  const canvases = await this.find({
    $or: [{ owner: user._id }, { shared_with: user._id }],
  });

  return canvases;
};

//Create a canvas for a user with given email 
canvasSchema.statics.createCanvas = async function (email, name){
  const user = await mongoose.model('User').findOne({email});
  try{
    if(!user){
      return Error('No use found');
    }
    const canvas = new this({
      owner : user._id,
      name,
      elements : [],
      shared_with : [],
    });
    const newCanvas = await canvas.save();
    return newCanvas;
  }
  catch(err){
    return Error('error creating new canvas');
  }
}

const Canvas = mongoose.model('Canvas', canvasSchema);
module.exports = Canvas;
