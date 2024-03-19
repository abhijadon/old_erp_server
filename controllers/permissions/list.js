const mongoose = require('mongoose');
const Permission = mongoose.model('Permission');

const list = async (req, res) => {
  try {
    // Constructing the query based on institute and university names
    const query = { removed: false };

    // Query the database for a list of results, populating the "user" field
    const results = await Permission.find(query).populate('userId');
 
    return res.status(200).json({
      success: true,
      result: results,
      message: 'Successfully found all documents',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: [],
      message: error.message,
      error: error,
    });
  }
};

module.exports = list;
