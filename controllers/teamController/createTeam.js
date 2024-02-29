const mongoose = require('mongoose');
const Team = mongoose.model('Team');

const create = async (req, res) => {
  try {
    const result = await Team.create(req.body);
   console.log('Received request body:', req.body);
    console.log('Received request headers:', req.headers);
    res.status(200).json({
      success: true,
      result: result,
      message: 'Team created successfully',
    });
  } catch (error) {
       console.error('Error saving to the database:', error);
    // If error is thrown by Mongoose due to required validations
    if (error.name == 'ValidationError') {
      res.status(400).json({
        success: false,
        result,
        message: 'Required fields are not supplied',
        error: error,
      });
    } else {
      // Server Error
      res.status(500).json({
        success: false,
        result,
        message: error.message,
        error: error,
      });
    }
  }
};

module.exports = create;
