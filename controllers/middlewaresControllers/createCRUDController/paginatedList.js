const paginatedList = async (Model, req, res) => {
  try {
    const resultsPromise = Model.find(req.queryConditions)
      .sort({ created: 'desc' })
      .populate({ path: 'userId', select: req.user.role === 'admin' ? '' : '-password' });

    const countPromise = Model.countDocuments(req.queryConditions);

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
