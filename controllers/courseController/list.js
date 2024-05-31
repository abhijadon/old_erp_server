const Course = require('@/models/Course')

const list = async (req, res) => {
  try {
    // Constructing the query based on institute and Course names
    const query = { removed: false };

    // Query the database for a list of results, populating the "user" field
    const results = await Course.find(query);
 
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
