const mongoose = require('mongoose');
const Team = require('@/models/Team'); // Adjust the path according to your project structure

const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming req.user is set after authentication
    const userRole = req.user.role; // Assuming the user's role is set in req.user

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (userRole === 'admin' || userRole === 'subadmin') {
      req.user.isAdmin = true;
      req.user.isTeamLeader = false;
      req.user.isSupportiveAssociate = false;
      req.user.isManager = false;
    } else if (userRole === 'manager') {
      req.user.isManager = true;
      req.user.isTeamLeader = false;
      req.user.isSupportiveAssociate = false;

      // Fetch the team details for the manager
      const team = await Team.findOne({ userId }).populate('teamMembers');

      if (team) {
        req.user.assignedInstitutes = team.institute; // Assuming these are arrays of institute names
        req.user.assignedUniversities = team.university; // Assuming these are arrays of university names
      } else {
        req.user.assignedInstitutes = [];
        req.user.assignedUniversities = [];
      }
    } else {
      req.user.isAdmin = false;
      req.user.isManager = false;

      // Check if the user is a team leader or supportive associate
      const team = await Team.findOne({ userId }).populate('teamMembers');

      if (team) {
        if (userRole === 'teamleader') {
          req.user.isTeamLeader = true;
          req.user.isSupportiveAssociate = false;
          req.user.assignedInstitutes = team.institute; // Assuming these are arrays of institute names
          req.user.assignedUniversities = team.university; // Assuming these are arrays of university names
        } else if (userRole === 'supportiveassociate') {
          req.user.isTeamLeader = false;
          req.user.isSupportiveAssociate = true;
          req.user.assignedInstitutes = team.institute; // Assuming these are arrays of institute names
          req.user.assignedUniversities = team.university; // Assuming these are arrays of university names
        }

        req.user.teamMembers = team.teamMembers.map(member => member._id); // Assuming member._id is the user's ID
      } else {
        req.user.isTeamLeader = false;
        req.user.isSupportiveAssociate = false;
        req.user.assignedInstitutes = [];
        req.user.assignedUniversities = [];
        req.user.teamMembers = [];
      }
    }

    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = authMiddleware;
