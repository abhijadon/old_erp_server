const mongoose = require('mongoose');
const Admin = mongoose.model('User');
const UserAction = require('@/models/UserAction')
const logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    // Find the admin by ID and update the status and user actions
    const result = await Admin.findOneAndUpdate(
      { _id: req.admin._id },
      { $pull: { loggedSessions: token }, status: 'offline' }, // Set status to 'offline' on logout
      { new: true }
    ).exec();

    // Create a new user action for logout
    const userAction = new UserAction({
      userId: req.admin._id,
      action: 'Logout',
    });

    // Save the user action to the admin's actions array
    result.actions.push(userAction);

    // Save the updated admin document
    await result.save();

    // Clear the authentication token cookie
    res.clearCookie('token', {
      maxAge: null,
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      domain: req.hostname,
      path: '/',
    });

    // Send response
    res.json({ isLoggedOut: true });
  } catch (error) {
    res.status(500).json({ success: false, result: null, message: error.message, error: error });
  }
};

module.exports = logout;
