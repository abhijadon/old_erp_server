const mongoose = require('mongoose');
const Team = mongoose.model('Team');

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('user teamMembers');

    return res.status(200).json({
      success: true,
      result: teams,
      message: 'Teams retrieved successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error,
    });
  }
};

module.exports =  getTeams
