const Team = require('@/models/Team');

const paginatedList = async (Model, req, res) => {
  try {
    const user = req.user;
    const instituteName = req.query.instituteName;
    const universityName = req.query.universityName;

    const userId = req.query.userId;

    // Build the initial query object
    let query = { removed: false };

    if (instituteName) {
      query['customfields.institute_name'] = instituteName;
    }
    if (universityName) {
      query['customfields.university_name'] = universityName;
    }

    if (userId) {
      const team = await Team.findOne({ userId }).populate('teamMembers');
      if (team) {
        const userIds = team.teamMembers.map(member => member._id.toString());
        userIds.push(team.userId.toString());
        query['userId'] = { $in: userIds };
      } else {
        return res.status(200).json({
          success: true,
          result: [],
          pagination: { page, pages: 0, count: 0 },
          message: 'No data found for the specified user',
        });
      }
    } else {
      if (user.role === 'manager') {
        const team = await Team.findOne({ userId: user._id }).populate('teamMembers');
        if (team) {
          const instituteNames = team.institute;
          const universityNames = team.university;
          query['customfields.institute_name'] = { $in: instituteNames };
          query['customfields.university_name'] = { $in: universityNames };
          query['institute_name'] = { $in: instituteNames };
          query['university_name'] = { $in: universityNames };
        } else {
          query['userId'] = null;
        }
      } else if (user.role === 'supportiveassociate') {
        const team = await Team.findOne({ userId: user._id }).populate('teamMembers');
        if (team) {
          const teamMemberIds = team.teamMembers.map(member => member._id.toString());
          query['userId'] = { $in: [user._id.toString(), ...teamMemberIds] };
          query['customfields.institute_name'] = { $in: team.institute };
          query['customfields.university_name'] = { $in: team.university };
          query['institute_name'] = { $in: team.institute };
          query['university_name'] = { $in: team.university };
        } else {
          query['userId'] = null;
        }
      } else if (user.role === 'teamleader') {
        const team = await Team.findOne({ userId: user._id }).populate('teamMembers');
        if (team) {
          const teamMemberIds = team.teamMembers.map(member => member._id.toString());
          query['userId'] = { $in: [user._id.toString(), ...teamMemberIds] };
        } else {
          query['userId'] = null;
        }
      } else if (user.role === 'admin' || user.role === 'subadmin') {
        // Admin and subadmin can see all data, no restrictions
      } else {
        query['userId'] = user._id.toString();
      }
    }


    // Fetch results with sorting and population, without pagination
    const resultsPromise = Model.find(query).populate('userId')

    // Count total documents
    const countPromise = Model.countDocuments(query).exec();

    // Resolve both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    // Calculate total pages
    const pages = Math.ceil(count);

    // Pagination information (count of total documents)
    const pagination = { pages };

    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(200).json({
        success: true,
        result: [],
        pagination,
        message: 'No data found for the specified criteria',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: [],
      message: error.message,
      error: error,
    });
  }
};

module.exports = paginatedList;