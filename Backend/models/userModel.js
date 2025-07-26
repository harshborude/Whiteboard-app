const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Register
userSchema.statics.register = async function ({ name, email, password }) {
  try {
    // Validate email
    if (!validator.isEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      throw new Error('Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol');
    }

    // Check if user already exists
    const existingUser = await this.findOne({ email });
    if (existingUser) throw new Error('User already exists with this email');

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    const user = new this({
      name,
      email,
      password: hashedPassword
    });

    const newUser = await user.save();
    return newUser;

  } catch (error) {
    throw new Error('Error registering: ' + error.message);
  }
};

// Get All Users
userSchema.statics.getUser = async function (email) {
  try{
    const user = await this.findOne({email});
    return user;
  }
  catch(error){
    throw new Error('Error getting user' + error.message);
  }
};

// Login
userSchema.statics.login = async function (email, password) {
  try {
    // Check if user with the email exists
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Return user object (you can later return token too)
    return user;

  } catch (error) {
    throw new Error('Login failed: ' + error.message);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
