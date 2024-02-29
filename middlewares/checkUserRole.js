// checkUserRoleMiddleware.js
const Team = require('@/models/Team');

const constructQuery = (user, instituteName, universityName) => {
  let query = { userId: user._id };

  // Add dynamic institute and university to the query if provided
  if (instituteName) {
    query['customfields.institute_name'] = instituteName;
  }
  if (universityName) {
    query['customfields.university_name'] = universityName;
  }

  return query;
};

const checkUserRoleMiddleware = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: User not found',
      });
    }

    const { instituteName, universityName } = req.query;
    const query = constructQuery(user, instituteName, universityName);

    // Additional condition for Team Leader
    if (user.role === 'teamleader') {
      const team = await Team.findOne({ user: user._id }).populate('teamMembers');

      if (team) {
        const teamMemberIds = team.teamMembers.map(member => member._id);
        // Create a copy of the query before modification
        query.userId = { $in: [user._id, ...teamMemberIds] };
      }
    }

    req.queryConditions = query; // Store the query in the request for use in subsequent routes
    next(); // Continue to the next middleware or route
  } catch (error) {
    console.error('Error in checkUserRoleMiddleware:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = checkUserRoleMiddleware;
