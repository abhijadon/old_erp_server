const UserHistory = require('@/models/UserHistory');

async function getStudentHistory(userId) {
  try {
    const history = await UserHistory.find({ userId: userId })
      .populate({
        path: 'userId',
        match: { _id: userId } // Filter only entries relevant to the specific student ID
      })
      .sort({ updatedAt: 'desc' })
      .exec();
    
    const filteredHistory = history.filter(entry => entry.userId); // Filter out null values if any
    const count = filteredHistory.length;

    return { history: filteredHistory, count };
  } catch (error) {
    console.error('Error fetching student history:', error.message);
    throw error;
  }
}

module.exports = {
  getStudentHistory,
};
