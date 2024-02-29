const filter = async (Model, req, res) => {
  try {
    const filterConditions = {};

    if (req.query.university_name !== undefined) {
      filterConditions['university_name'] = req.query.university_name;
    }

    if (req.query.institute_name !== undefined) {
      filterConditions['institute_name'] = req.query.institute_name;
    }


    if (req.query.session !== undefined) {
      filterConditions['session'] = req.query.session;
    }

    if (req.query.status !== undefined) {
      filterConditions['status'] = req.query.status;
    }

    // Additional filter based on userId
    if (req.query.userId !== undefined) {
      filterConditions['userId'] = req.query.userId;
    }

    const results = await Model.find({ removed: false, ...filterConditions })
      .sort({ date: -1, time: -1 }) // Sort by date and time in descending order
      .populate('userId');

    const count = await Model.countDocuments({ removed: false, ...filterConditions });

    const filterMessage = Object.keys(filterConditions)
      .map((key) => `${key}: ${filterConditions[key]}`)
      .join(', ');

    if (count > 0) {
      return res.status(200).json({
        success: true,
        result: results,
        count: count,
        message: `Successfully found documents where ${filterMessage}`,
      });
    } else {
      return res.status(203).json({
        success: true,
        result: [],
        count: 0,
        message: `No matching documents found with the given filter conditions: ${filterMessage}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = filter;
