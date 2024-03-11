  const mongoose = require('mongoose');
  const Admin = mongoose.model('User');

  const paginatedList = async (req, res) => {
    try {
      const results = await Admin.find({ removed: false, enabled: true });

      // Counting the total documents
      const count = await Admin.countDocuments({ removed: false });

      if (count > 0) {
        return res.status(200).json({
          success: true,
          result: results,
          message: 'Successfully found all documents',
        });
      } else {
        return res.status(203).json({
          success: false,
          result: [],
          message: 'Collection is Empty',
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        result: [],
        message: 'Error retrieving documents',
        error: error.message,
      });
    }
  };

  module.exports = paginatedList;
