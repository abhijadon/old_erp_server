const jwt = require('jsonwebtoken');
const User = require('@/models/User');

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'No authentication token, authorization denied.',
      });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Token verification failed, authorization denied.',
      });
    }

    const user = await User.findOne({ _id: verified.id, removed: false });

    if (!user) {
      return res.status(401).json({
        success: false,
        result: null,
        message: "User doesn't exist, authorization denied.",
      });
    }

    // Check if session ID matches
    if (user.sessionId !== verified.sessionId || !user.isLoggedIn) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Session is invalid or user is logged out.',
        jwtExpired: true,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(503).json({
      success: false,
      result: null,
      message: 'Service unavailable, please try again later.',
      error: error.message,
    });
  }
};

module.exports = authenticate;
