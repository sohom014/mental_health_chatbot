const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with that email or username already exists"
      });
    }
    
    // Create user (password hashing is done in the User model pre-save hook)
    const user = await User.create({ username, email, password });
    
    // Generate token
    const token = generateToken(user._id);
    
    // Remove password from response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.status(201).json({
      success: true,
      token,
      data: userResponse
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password"
      });
    }
    
    // Check for user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }
    
    // Check if password matches (using method defined in User model)
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Remove password from response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.status(200).json({
      success: true,
      token,
      data: userResponse
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.logout = async (req, res) => {
  // For stateless JWT-based auth, "logout" is handled client-side
  res.status(200).json({
    success: true,
    data: {}
  });
};

exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Not authorized"
      });
    }
    
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};