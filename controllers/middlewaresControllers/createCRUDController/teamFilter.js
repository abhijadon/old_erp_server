const Team = require('@/models/Team');

const paginatedList = async (Model, req, res) => {
  try {
    const instituteName = req.query.instituteName;
    const universityName = req.query.universityName;
    const userId = req.query.userId;
    const teammembersId = req.query.teammembersId;
 
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
        const userIds = team.teamMembers.map(member => member._id);
        userIds.push(team.userId);
        query['userId'] = { $in: userIds.map(id => id.toString()) }; // Convert to string
      } else {
        return res.status(200).json({
          success: true,
          result: [],
          count: 0,
          message: 'No data found for the specified user',
        });
      }
    }

    if (teammembersId) {
      query['userId'] = { $in: [...teammembersId, userId] };
    }

    const resultsPromise = Model.find(query)
      .sort({ created: 'desc' })
      .populate('userId')
      .exec();

    const countPromise = Model.countDocuments(query).exec();

    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    if (count > 0) {
      const formattedResults = result.map(item => ({
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
