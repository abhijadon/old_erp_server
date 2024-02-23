const Team = require("@/models/Team");
// middleware/checkTeamMembers.js
const checkTeamMembers = async (req, res, next) => {
  try {
    const { user, teamMembers } = req.body;

    if (!user || !teamMembers) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Both user and teamMembers are required.',
      });
    }

    // Get the team leader's institute and university
    const teamLeader = await Team.findById(user);
    const teamLeaderInstitute = teamLeader.institute;
    const teamLeaderUniversity = teamLeader.university;

    // Check if any team member has the same institute or university as the team leader
    for (const member of teamMembers) {
      const teamMember = await Team.findById(member);
      if (!teamMember) {
        console.error(`Team member with ID ${member} not found.`);
        continue;
      }

      if (
        !teamMember.institute ||
        !teamMember.institute.length ||
        !teamLeaderInstitute.some(inst => teamMember.institute.includes(inst)) ||
        !teamMember.university ||
        !teamMember.university.length ||
        !teamLeaderUniversity.some(uni => teamMember.university.includes(uni))
      ) {
        continue;
      }

      return res.status(400).json({
        success: false,
        result: null,
        message: 'One or more team members already belong to the team leader\'s institute or university.',
      });
    }

    // If all checks pass, move to the next middleware or the route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error,
    });
  }
};

module.exports = checkTeamMembers;


