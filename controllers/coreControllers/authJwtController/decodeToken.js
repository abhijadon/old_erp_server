// decodeToken.js
const jwt = require('jsonwebtoken');

const decodeToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log('No authentication token found in the request.');
    return res.status(401).json({ success: false, message: 'No authentication token, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Assuming your decoded token contains admin information
    next();
  } catch (error) {
    console.error('Error decoding authentication token:', error);
    return res.status(401).json({ success: false, message: 'Invalid authentication token, authorization denied.' });
  }
};

module.exports = decodeToken;
