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
    share_requests: [
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
  }).populate('owner', 'name'); // Populate owner with just the name

  return canvases;
};

//Create a canvas for a user with given email 
canvasSchema.statics.createCanvas = async function (email, name){
  const user = await mongoose.model('User').findOne({email});
  try{
    if(!user){
      throw new Error('No user found');
    }
    const canvas = new this({
      owner : user._id,
      name,
      elements : [],
      shared_with : [],
      share_requests: [],
    });
    const newCanvas = await canvas.save();
    return newCanvas;
  }
  catch(err){
    throw new Error('error creating new canvas');
  }
}

canvasSchema.statics.loadCanvas = async function(email ,id){
  const user = await mongoose.model('User').findOne({email});
  try{
    if(!user) {
      throw new Error('user not found');
    }
    const canvas = await this.findOne({_id : id, $or : [{owner: user._id}, {shared_with : user._id}]});
    return canvas;
  }
  catch(err){
    throw new Error('Failed getting canvas');
  }
}

canvasSchema.statics.updateCanvas = async function (email, id, elements) {
  try {
    const user = await mongoose.model('User').findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    // Use findOneAndUpdate instead of findOne + save
    const updatedCanvas = await this.findOneAndUpdate(
      { 
        _id: id, 
        $or: [
          { owner: user._id }, 
          { shared_with: user._id }
        ] 
      },
      { $set: { elements: elements } },
      { new: true } // Returns the updated document instead of the old one
    );

    if (!updatedCanvas) {
      throw new Error('Canvas not found');
    }

    return updatedCanvas;

  } catch (err) {
    throw new Error(`Failed to update canvas: ${err.message}`);
  }
};

canvasSchema.statics.deleteCanvas = async function (email, id) {
  const user = await mongoose.model('User').findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // Only allow the owner to delete the canvas
  const deletedCanvas = await this.findOneAndDelete({ _id: id, owner: user._id });
  
  if (!deletedCanvas) {
    throw new Error('Canvas not found or you do not have permission to delete it');
  }

  return deletedCanvas;
};


// Share Requests functionality
canvasSchema.statics.sendShareRequest = async function(email, id, targetEmail) {
  const user = await mongoose.model('User').findOne({ email });
  const targetUser = await mongoose.model('User').findOne({ email: targetEmail });

  if (!user || !targetUser) {
    throw new Error('User not found');
  }

  if (email === targetEmail) {
    throw new Error('You cannot share a canvas with yourself');
  }

  // Must be owner to share
  const canvas = await this.findOne({ _id: id, owner: user._id });
  if (!canvas) {
    throw new Error('Canvas not found or you are not the owner');
  }

  if (canvas.shared_with.includes(targetUser._id)) {
    throw new Error('Canvas is already shared with this user');
  }

  if (canvas.share_requests.includes(targetUser._id)) {
    throw new Error('A share request has already been sent to this user');
  }

  canvas.share_requests.push(targetUser._id);
  await canvas.save();
  return canvas;
};

canvasSchema.statics.getIncomingRequests = async function(email) {
  const user = await mongoose.model('User').findOne({ email });
  if (!user) throw new Error('User not found');

  const requests = await this.find({
    share_requests: user._id
  }).populate('owner', 'name email'); // Populate owner details to show who sent it

  return requests;
};

canvasSchema.statics.acceptRequest = async function(email, id) {
  const user = await mongoose.model('User').findOne({ email });
  if (!user) throw new Error('User not found');

  const canvas = await this.findOne({ _id: id, share_requests: user._id });
  if (!canvas) {
    throw new Error('Request not found');
  }

  // Remove from requests, add to shared_with
  canvas.share_requests = canvas.share_requests.filter(reqId => !reqId.equals(user._id));
  if (!canvas.shared_with.includes(user._id)) {
    canvas.shared_with.push(user._id);
  }

  await canvas.save();
  return canvas;
};

canvasSchema.statics.rejectRequest = async function(email, id) {
  const user = await mongoose.model('User').findOne({ email });
  if (!user) throw new Error('User not found');

  const canvas = await this.findOne({ _id: id, share_requests: user._id });
  if (!canvas) {
    throw new Error('Request not found');
  }

  // Remove from requests
  canvas.share_requests = canvas.share_requests.filter(reqId => !reqId.equals(user._id));
  await canvas.save();
  return canvas;
};

const Canvas = mongoose.model('Canvas', canvasSchema);
module.exports = Canvas;
