const jwt = require('jsonwebtoken');
const User = require('@/models/User'); // Adjust the path accordingly

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
// Assuming the token is in the format 'Bearer TOKEN'

    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }

    req.user = user; // Set the user in the request object
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};

module.exports = authenticate;
