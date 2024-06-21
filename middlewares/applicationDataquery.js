const Team = require('@/models/Team'); // Adjust the path as per your project structure
const mongoose = require('mongoose');

const authorizeUser = async (req, res, next) => {
  try {
    const user = req.user;

    // Initialize query with basic conditions
    let query = { removed: false };

    // Apply role-based or user-specific filters
    if (user.role === 'manager' || user.role === 'supportiveassociate' || user.role === 'teamleader') {
      const team = await Team.findOne({ userId: user._id }).populate('teamMembers');
      if (team) {
        if (user.role === 'manager') {
          const instituteNames = team.institute;
          const universityNames = team.university;
          query['institute_name'] = { $in: instituteNames };
          query['university_name'] = { $in: universityNames };
        } else if (user.role === 'supportiveassociate') {
          const teamMemberIds = team.teamMembers.map(member => member._id.toString());
          query['userId'] = { $in: [user._id.toString(), ...teamMemberIds] };
          query['institute_name'] = { $in: team.institute };
          query['university_name'] = { $in: team.university };
        } else if (user.role === 'teamleader') {
          const teamMemberIds = team.teamMembers.map(member => member._id.toString());
          query['userId'] = { $in: [user._id.toString(), ...teamMemberIds] };
        }
      } else {
        query['userId'] = null; // No team found for the user
      }
    } else if (user.role === 'admin' || user.role === 'subadmin') {
      // Admin and subadmin can see all data, no restrictions
    } else {
      query['userId'] = user._id.toString(); // Regular user can see their own data
    }

    // Update the request object with the modified query
    req.authorizedQuery = query;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

module.exports = authorizeUser;
