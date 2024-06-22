const mongoose = require('mongoose');
const Team = require('@/models/Team');

const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user.isAdmin = userRole === 'admin' || userRole === 'subadmin';
    req.user.isManager = userRole === 'manager';
    req.user.isTeamLeader = userRole === 'teamleader';
    req.user.isSupportiveAssociate = userRole === 'supportiveassociate';

    if (req.user.isManager || req.user.isTeamLeader || req.user.isSupportiveAssociate) {
      const team = await Team.findOne({ userId }).populate('teamMembers');

      if (team) {
        req.user.assignedInstitutes = team.institute || [];
        req.user.assignedUniversities = team.university || [];
        req.user.teamMembers = team.teamMembers.map(member => member._id) || [];
      } else {
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
