const mongoose = require('mongoose');
const Team = mongoose.model('Team');

const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params; // Assuming you are passing the teamId as a URL parameter

    // Validate if the teamId is provided
    if (!teamId) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'teamId is required.',
      });
    }

    // Find the team by teamId and remove it
    const deletedTeam = await Team.findByIdAndRemove(teamId);

    if (!deletedTeam) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Team not found.',
      });
    }

    return res.status(200).json({
      success: true,
      result: deletedTeam,
      message: 'Team deleted successfully.',
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

module.exports = deleteTeam;
