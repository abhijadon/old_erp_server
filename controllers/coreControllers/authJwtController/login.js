const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const UserAction = require('@/models/UserAction');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate URL
    const address = req.get('origin') || 'http://localhost';
    const urlObject = new URL(address);

    const orginalHostname = urlObject.hostname;
    const isLocalhost = orginalHostname === 'localhost';

    // Validate input
    const objectSchema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = objectSchema.validate({ username, password });
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

    // Validate user existence and password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Invalid credentials.',
      });
    }

    // Generate JWT token with expiration
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Set expiration to 1 hour
    );

    // Fetch user data based on role
    let userData;
    if (user.role === 'admin') {
      // Admin can see data for all users
      userData = await User.find({ removed: false }).exec();
    } else {
      // Regular user can only see their own data
      userData = [user]; // Wrap the user in an array for consistent data structure
    }

    // Update user session information
    const result = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { isLoggedIn: true, status: 'online' },
        $push: { loggedSessions: { token, expiration: new Date(Date.now() + 60 * 60 * 1000) } },
      },
      { new: true }
    ).exec();

    const userAction = new UserAction({
      userId: req._id,
      action: 'Login',
    });

    // Save the user action to the admin's actions array
    result.actions.push(userAction);

    // Save the updated admin document
    await result.save();

    res.cookie('token', token, {
      maxAge: 60 * 60 * 1000, // Set cookie expiration to 1 hour
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      domain: req.hostname,
      path: '/',
      Partitioned: true,
    });

    res.status(200).json({
      success: true,
      result: {
        _id: result._id,
        fullname: result.fullname,
        surname: result.surname,
        status: result.status,
        role: result.role,
        username: result.username,
        photo: result.photo,
        isLoggedIn: true,
        users: userData, // Include the retrieved user data
      },
      message: `Welcome, you are successfully logged in, ${result.fullname}.`,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};

module.exports = login;
