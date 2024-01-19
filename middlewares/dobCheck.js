const validateDOBFormatMiddleware = (req, res, next) => {
  console.log('Received Request Payload:', req.body);

  // Assuming DOB is in the request body under the 'customfields.dob' property
  const dob = req.body.customfields?.dob;

  // Check if DOB is defined
  if (!dob) {
    return res.status(400).json({ error: 'DOB is required in customfields' });
  }

  // Regular expressions for different date formats
  const dobFormats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
    /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
  ];

  // Check if DOB matches any of the expected formats
  if (!dobFormats.some((format) => format.test(dob))) {
    return res
      .status(400)
      .json({ error: 'Invalid DOB format. Use YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY, or DD/MM/YYYY' });
  }

  // Continue to the next middleware or route handler
  next();
};

module.exports = validateDOBFormatMiddleware;
