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


// const jwt = require('jsonwebtoken');
// const User = require('@/models/User');

// const authenticate = async (req, res, next) => {
//   try {
//     // Get the token from the 'Authorization' header
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         success: false,
//         result: null,
//         message: 'No authorization token, authorization denied.',
//       });
//     }

//     // Extract the token after "Bearer "
//     const token = authHeader.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         result: null,
//         message: 'Invalid authorization token, authorization denied.',
//       });
//     }

//     // Verify the JWT token
//     const verified = jwt.verify(token, process.env.JWT_SECRET);

//     if (!verified) {
//       return res.status(401).json({
//         success: false,
//         result: null,
//         message: 'Token verification failed, authorization denied.',
//       });
//     }

//     // Find the user with the verified ID and ensure they are not removed
//     const user = await User.findOne({ _id: verified.id, removed: false });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         result: null,
//         message: "User doesn't exist, authorization denied.",
//       });
//     }

//     // Check session validity
//     if (user.sessionId !== verified.sessionId || !user.isLoggedIn) {
//       return res.status(401).json({
//         success: false,
//         result: null,
//         message: 'Session is invalid or user is logged out.',
//         jwtExpired: true,
//       });
//     }

//     req.user = user; // Add the user object to the request
//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     res.status(503).json({
//       success: false,
//       result: null,
//       message: 'Service unavailable, please try again later.',
//       error: error.message,
//     });
//   }
// };

// module.exports = authenticate;
