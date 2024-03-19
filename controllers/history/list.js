const { HistoryEntry } = require('@/models/Application');

const list = async (req, res) => {
  try {
    const query = { removed: false };
    // Query the database for a list of results
    const results = await HistoryEntry.find(query);

    // Count the number of results
    const count = results.length;

    return res.status(200).json({
      success: true,
      count: count, // Include the count in the response
      result: results,
      message: 'History entries retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      count: 0, // If an error occurs, count will be 0
      result: [],
      message: error.message,
      error: error,
    });
  }
};

module.exports = list;
