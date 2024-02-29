// teamController.js

const mongoose = require('mongoose');
const Team = require('@/models/Team');

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, teamName, institute, university, teamMembers } = req.body;

    if (!user || !teamName) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'user and teamName are required.',
      });
    }

    const existingTeam = await Team.findByIdAndUpdate(
      id,
      {
        $set: {
          user,
          teamName,
          institute,
          university,
          teamMembers,
        },
      },
      { new: true }
    );

    if (!existingTeam) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Team not found.',
      });
    }

    return res.status(200).json({
      success: true,
      result: existingTeam,
      message: 'Team updated successfully.',
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

module.exports = updateTeam;
