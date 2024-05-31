const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
  const { userId } = req.params;

  if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ObjectId'
    });
  }

  next();
};

module.exports = validateObjectId;
