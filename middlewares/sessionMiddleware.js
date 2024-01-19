// middleware.js

const validateSessionMiddleware = (req, res, next) => {
  // Updated regular expression to match the "jan 20-jan 20" format
  const sessionFormatRegex = /^[a-zA-Z]+\s\d{1,2}-[a-zA-Z]+\s\d{1,2}$/;

  const sessionData = req.body.customfields?.session;

  // Log session data to the console
  console.log('Session Data:', sessionData);

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
