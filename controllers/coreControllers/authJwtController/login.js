// Importing necessary modules
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const uuid = require('uuid'); // For generating unique session IDs
const mongoose = require('mongoose');
const useragent = require('useragent'); // Library to parse user-agent information
const User = mongoose.model('User'); // User model
const UserLog = mongoose.model('UserLog'); // User log model

// Function to extract client IP address from request
const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    // Handle cases where client is behind a proxy
    return forwardedFor.split(',')[0].trim();
  }
  // Fallback to direct IP address
  return req.ip || req.connection.remoteAddress;
};

// Login function
const login = async (req, res) => {
  const clientIp = getClientIp(req); // Extract client IP address

  try {
    const { username, password } = req.body;

    const schema = Joi.object({
      username: Joi.string().min(3).max(255).required(),
      password: Joi.string().min(6).max(255).required(),
    });

    const { error } = schema.validate({ username, password });
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing credentials.',
        errorMessage: error.message,
      });
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const sessionId = uuid.v4();
    const token = jwt.sign(
      { id: user._id, sessionId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    user.isLoggedIn = true;
    user.status = 'online';
    user.sessionId = sessionId;
    await user.save();

    const agent = useragent.parse(req.headers['user-agent']);
    const device = agent.device.toString();
    const browser = agent.toAgent();
    const os = agent.os.toString();

    // Create a new user log on login
    const userLog = new UserLog({
      userId: user._id,
      login: new Date(),
      logout: new Date(),
      ip: clientIp,
      device,
      browser,
      os,
    });

    await userLog.save();

    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      path: '/',
    });

    res.status(200).json({
      success: true,
      result: {
        _id: user._id,
        fullname: user.fullname,
        status: user.status,
        role: user.role,
        username,
        photo: user.photo,
        isLoggedIn: true,
      },
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