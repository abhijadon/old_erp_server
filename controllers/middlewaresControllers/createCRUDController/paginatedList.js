const Team = require("@/models/Team");

const paginatedList = async (Model, req, res) => {
  try {
    const user = req.user;
    const instituteName = req.query.instituteName;
    const universityName = req.query.universityName;

    // Constructing the query based on institute and university names and user
    let query = { removed: false };

    // Add dynamic institute and university to the query if provided
    if (instituteName) {
      query['customfields.institute_name'] = instituteName;
    }
    if (universityName) {
      query['customfields.university_name'] = universityName;
    }

    let team;

    if (user.role === 'supportiveassociate' || user.role === 'teamleader') {
      team = await Team.findOne({ userId: user._id }).populate('teamMembers');
    }

    if (user.role === 'supportiveassociate') {
      // Modify the query to include only data related to the supportiveassociate
      const team = await Team.findOne({ userId: user._id }).populate('teamMembers');

      if (team) {
        // Extract the institute, university, and divided from the supportive associate's team
        query['customfields.institute_name'] = { $in: team.institute };
        query['customfields.university_name'] = { $in: team.university };
        query['divided'] = team.divided;

        // Count the total number of supportive associates
        const supportiveAssociatesCount = await Team.countDocuments({
          divided: { $gt: 0 }, // Consider only those with a positive 'divided' value
        });

        // Query the database for the total count of documents
        const totalCount = await Model.countDocuments(query);

        // Calculate the number of documents each supportive associate should receive
        const documentsPerSupportiveAssociate = Math.ceil(totalCount / supportiveAssociatesCount);

        // Calculate the skip value for the current supportive associate
        const skip = team.divided * documentsPerSupportiveAssociate;

        // Query the database for a limited list of results
        const resultsPromise = Model.find(query)
          .sort({ created: 'desc' })
          .skip(skip)
          .limit(documentsPerSupportiveAssociate)
          .populate('userId');

        // Resolving the results promise
        const result = await resultsPromise;

        // Update the 'divided' value for the next round of division
        await Team.updateOne({ userId: user._id }, { $inc: { divided: 1 } });

        // Format date and time before sending the response
        const formattedResults = result.map((item) => ({
          ...item._doc,
          date: item.date ? new Date(item.date).toLocaleDateString('en-US') : null,
          time: item.time,
        }));

        return res.status(200).json({
          success: true,
          result: formattedResults,
          count: result.length,
          message: 'Successfully found documents for the supportive associate',
        });
      } else {
        // If no team is found for the supportive associate, return an empty result
        return res.status(200).json({
          success: true,
          result: [],
          count: 0,
          message: 'No team found for the supportive associate',
        });
      }
    } else if (user.role === 'teamleader') {
      // Add the existing condition for Team Leader
      const team = await Team.findOne({ userId: user._id }).populate('teamMembers');

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
