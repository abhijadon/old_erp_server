// middleware.js
const validateSessionMiddleware = (req, res, next) => {
  // Updated regular expression to allow both "jan 30" and "jan 30 - jan 30" formats
  const sessionFormatRegex = /^[a-zA-Z]+\s\d{1,2}(\s?-\s?[a-zA-Z]+\s\d{1,2})?$/;

  const sessionData = req.body.customfields?.session;
  // Check if the session data exists and matches the expected format
  if (sessionData && sessionFormatRegex.test(sessionData)) {
    // If the session format is correct, proceed to the next middleware or route
    next();
  } else {
    // If the session format is incorrect, send an error message
    res.status(403).json({ error: 'Invalid session format' });
  }
};

module.exports = validateSessionMiddleware;
