const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const uuid = require('uuid'); // For generating unique session IDs

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate the input
    const schema = Joi.object({
      username: Joi.string().min(3).max(255).required(),
      password: Joi.string().min(6).max(255).required(),
    });
    const { error } = schema.validate({ username, password });
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid/Missing credentials.',
        errorMessage: error.message,
      });
    }

    // Find the user
    const user = await User.findOne({ username, removed: false });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Generate a unique session ID
    const sessionId = uuid.v4();

    // Generate a JWT token with a 7-day expiration
    const token = jwt.sign(
      { id: user._id, sessionId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // 7 days
    );

    // Update the user's session ID and status
    user.isLoggedIn = true;
    user.status = 'online';
    user.sessionId = sessionId; // Store the session ID
    await user.save();

    // Set the token in a cookie with a 7-day expiration
    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      domain: req.hostname,
      path: '/',
    });

    // Response data
    const responseData = {
      _id: user._id,
      fullname: user.fullname,
      status: user.status,
      role: user.role,
      username: user.username,
      photo: user.photo,
      isLoggedIn: true,
    };

    res.status(200).json({
      success: true,
      result: responseData,
      message: `Welcome, you are successfully logged in, ${user.fullname}.`,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      error: error.message,
    });
  }
};

module.exports = login;
