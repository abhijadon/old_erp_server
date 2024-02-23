const Team = require('@/models/Team');

const updateTeam = async (req, res) => {
  try {
    const { user, teamName, institute, university, teamMembers } = req.body;

    if (!user || !teamName) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'user and teamName are required.',
      });
    }

    const existingTeams = await Team.find({
      'user.username': user.username,
      'teamName': { $regex: new RegExp(teamName.trim(), 'i') },
    }).collation({ locale: 'en', strength: 2 });

    console.log('Existing Teams:', existingTeams);

    if (!existingTeams || existingTeams.length === 0) {
      console.log('Team not found. User:', user.username, 'TeamName:', teamName);
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Team not found.',
      });
    }

    // Assuming you want to update the first team in the array, you can change this as needed.
    const existingTeam = existingTeams[0];

    console.log('Updating Team:', existingTeam);

    // Check if the user updating is the team leader
    console.log('User updating:', user);
    console.log('Existing Team leader:', existingTeam.user);

    if (existingTeam.user.username !== user.username || existingTeam.user.role !== 'teamleader') {
      console.log('Permission denied. User:', user.username);
      return res.status(403).json({
        success: false,
        result: null,
        message: 'You do not have permission to update this team.',
      });
    }

    // Update team details
    existingTeam.user.fullname = user.fullname;
    existingTeam.user.phone = user.phone;

    existingTeam.teamName = teamName;
    existingTeam.institute = institute;
    existingTeam.university = university;

    // Update team members
    if (teamMembers) {
      // Assuming teamMembers is an array of user IDs
      existingTeam.teamMembers = teamMembers;
    }

    const updatedTeam = await existingTeam.save();

    console.log('Updated Team:', updatedTeam);

    return res.status(200).json({
      success: true,
      result: updatedTeam,
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
