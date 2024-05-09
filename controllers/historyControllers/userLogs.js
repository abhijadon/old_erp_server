const { UserLog } = require('@/models/userRecordslogs'); // Adjust path as needed

const userlog = async (req, res) => {
  try {
    if (!UserLog || typeof UserLog.find !== 'function') {
      throw new Error("UserLog model is not defined or imported incorrectly");
    }

    const query = { removed: false };

    const resultsPromise = UserLog.find(query)
      .sort({ createdAt: 'desc' })
      .populate('userId'); // Populating user information (add more as needed)

    const countPromise = UserLog.countDocuments(query);

    const [results, count] = await Promise.all([resultsPromise, countPromise]);

    if (count > 0) {
      const formattedResults = results.map((item) => ({
        ...item.toObject(),
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US') : null,
        time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString('en-US') : null,
      }));

      res.status(200).json({
        success: true,
        result: formattedResults,
        count,
        message: 'Successfully found all documents',
      });
    } else {
      res.status(200).json({
        success: true,
        result: [],
        count: 0,
        message: 'No data found matching the specified criteria',
      });
    }
  } catch (error) {
    console.error('User log error:', error);
    res.status(500).json({
      success: false,
      result: [],
      message: `An error occurred: ${error.message}`, // Informative error message
      error, // Include the error object for debugging
    });
  }
};

module.exports = userlog; // Export the function
