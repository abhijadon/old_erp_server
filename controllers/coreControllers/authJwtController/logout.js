const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // Import the jwt library

const Admin = mongoose.model('Admin');

const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    const result = await Admin.findOneAndUpdate(
      { _id: req.admin._id },
      { $pull: { loggedSessions: token } },
      { new: true }
    ).exec();

    // Clear the cookie and set its expiration to the current time (expires the cookie immediately)
    res
      .clearCookie('token', {
        expires: new Date(0),
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        domain: req.hostname,
        path: '/',
      })
      .json({ isLoggedOut: true });
  } catch (error) {
    res.status(500).json({ success: false, result: null, message: error.message, error: error });
  }
};

module.exports = logout;
