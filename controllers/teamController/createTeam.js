const mongoose = require('mongoose');
const Team = mongoose.model('Team');

const create = async (req, res) => {
  try {
    // Check if a team with the same userId already exists
    const existingTeam = await Team.findOne({ userId: req.body.userId });

    if (existingTeam) {
      // Team with the same userId already exists
      return res.status(400).json({
        success: false,
        message: 'Team with the provided userId already exists',
        error: null,
      });
    }

    // Create a new team if userId is not duplicate
    const result = await Team.create(req.body);

    res.status(200).json({
      success: true,
      result: result,
      message: 'Team created successfully',
    });
  } catch (error) {
    console.error('Error saving to the database:', error);

    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        result,
        message: 'Required fields are not supplied',
        error: error,
      });
    } else {
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
