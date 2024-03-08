const Team = require("@/models/Team");

const paginatedList = async (Model, req, res) => {
  const user = req.user;
  const instituteName = req.query.instituteName;
  const universityName = req.query.universityName;

  try {
    // Constructing the query based on institute and university names and user
    let query = { removed: false };

    // Add dynamic institute and university to the query if provided
    if (instituteName) {
      query['customfields.institute_name'] = instituteName;
    }
    if (universityName) {
      query['customfields.university_name'] = universityName;
    }

    // Additional condition for Team Leader
    if (user.role === 'teamleader') {
      const team = await Team.findOne({ user: user._id }).populate('teamMembers');

      if (team) {
        const teamMemberIds = team.teamMembers.map(member => member._id);
        // Limit the query to the team leader and team members
        query.userId = { $in: [user._id, ...teamMemberIds] };
      }
    } else if (user.role === 'admin') {
      // Admin gets all data, so no need to modify the query
    } else {
      // For other roles, limit the query to the user's own data
      query.userId = user._id;
    }

    // Query the database for a list of results
    const resultsPromise = Model.find(query)
      .sort({ created: 'desc' })
      .populate('userId');

    // Counting the total documents
    const countPromise = Model.countDocuments(query);

    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    if (count > 0) {
      // Format date and time before sending the response
      const formattedResults = result.map((item) => ({
        ...item._doc,
        date: item.date ? new Date(item.date).toLocaleDateString('en-US') : null,
        time: item.time,
      }));

      return res.status(200).json({
        success: true,
        result: formattedResults,
        count,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(200).json({
        success: true,
        result: [],
        count: 0,
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
