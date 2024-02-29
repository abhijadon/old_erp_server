// controllers.js
const { HistoryEntry } = require('@/models/Application');

const getHistoryEntries = async (req, res) => {
  try {
    const historyEntries = await HistoryEntry.find();
    return res.status(200).json({
      success: true,
      message: 'History entries retrieved successfully',
      historyEntries,
    });
  } catch (error) {
    console.error('Error retrieving history entries:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = { getHistoryEntries };
