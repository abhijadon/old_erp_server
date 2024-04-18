const Team = require('@/models/Team');

const create = async (req, res) => {
  try {
    // Extract data from the request body
    const { userId, teamMembers, institute, university, teamName } = req.body;

    // Check if a team with the provided userId already exists
    const existingTeam = await Team.findOne({ userId });

    if (existingTeam) {
      // If a team with the same userId already exists, return a 400 status with an error message
      return res.status(400).json({
        success: false,
        message: 'Team with the provided userId already exists',
      });
    }

    // Create a new team instance
    const team = new Team({
      userId,
      teamMembers,
      institute,
      university,
      teamName,
    });

    // Save the new team to the database
    await team.save();

    // Send a success response
    res.status(201).json({
      success: true,
      result: team,
      message: 'Team created successfully',
    });
  } catch (error) {
    // Handle errors
    console.error('Error creating team:', error);

    // Send an error response
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  create,
};
