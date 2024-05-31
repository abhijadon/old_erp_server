const mongoose = require('mongoose');
const Admin = mongoose.model('User');
const UserLog = mongoose.model('UserLog'); // User log model
const User = mongoose.model('User');
const logout = async (req, res) => {
  try {
    if (!req.admin || !req.admin._id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid logout request: User information is missing',
      });
    }

    const userId = req.admin._id;

    // Find and update the log with `logout: null`
    const userLog = await UserLog.findOneAndUpdate(
      { userId },
      { logout: new Date() },
      { new: true }
    );

    if (!userLog) {
      return res.status(404).json({
        success: false,
        message: 'No active user log found to update',
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { status: 'offline', isLoggedIn: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.clearCookie('token', {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      path: '/',
    });

    res.json({ success: true, message: 'Successfully logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      error: error.message,
    });
  }
};

module.exports = logout;

