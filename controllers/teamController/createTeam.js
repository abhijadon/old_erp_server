const mongoose = require('mongoose');
const Team = mongoose.model('Team');

const createTeam = async (req, res) => {
  try {
    const { user, teamName, institute, university, teamMembers } = req.body;

    // Validate if the required fields are provided
    if (!user || !teamName) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'user and teamName are required.',
      });
    }

    const existingTeam = await Team.findOne({ user });

    if (existingTeam) {
      // User ID is not unique
      return res.status(400).json({
        success: false,
        message: 'User with this ID already belongs to another team. Please choose another ID.',
      });
    }

    const newTeam = new Team({
      user,
      teamName,
      institute,
      university,
      teamMembers,
    });

    const savedTeam = await newTeam.save();

    return res.status(201).json({
      success: true,
      result: savedTeam,
      message: 'Team created successfully.',
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

module.exports = createTeam;
