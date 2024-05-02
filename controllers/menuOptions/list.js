const MenuOptons = require('@/models/menuOptionsModel');

const list = async (req, res) => {
  try {
    // Constructing the query based on institute and university names
    const query = { removed: false };

    // Query the database for a list of results, populating the "user" field
    const results = await MenuOptons.find(query);
 
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
