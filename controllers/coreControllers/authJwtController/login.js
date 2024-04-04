const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input fields
    const schema = Joi.object({
      username: Joi.string().min(3).max(255).required(),
      password: Joi.string().min(6).max(255).required(),
    });
    const { error } = schema.validate({ username, password });
    if (error) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid/Missing credentials.',
        errorMessage: error.message,
      });
    }

    // Find user by username
    const user = await User.findOne({ username, removed: false });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Invalid credentials.',
      });
    }

    // Generate JWT token with expiration for 360 days
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '360d' });

    // Update user session information
    user.isLoggedIn = true;
    user.status = 'online';
    await user.save();

    // Set cookie with the same expiration time as the token
    res.cookie('token', token, {
      maxAge: 360 * 24 * 60 * 60 * 1000, // 360 days
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      domain: req.hostname,
      path: '/',
    });

    // Fetch user data based on role
    let userData;
    if (user.role === 'admin') {
      userData = await User.find({ removed: false }).exec();
    } else {
      userData = [user];
    }

    // Prepare response data
    const responseData = {
      _id: user._id,
      fullname: user.fullname,
      surname: user.surname,
      status: user.status,
      role: user.role,
      username: user.username,
      photo: user.photo,
      isLoggedIn: true,
      users: userData,
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
      result: null,
      message: 'Internal server error. Please try again later.',
      error: error.message,
    });
  }
};

module.exports = login;
