const mongoose = require('mongoose');
const Model = mongoose.model('Payment');

const read = async (req, res) => {
  try {
    // Find document by id
    const result = await Model.findOne({ _id: req.params.id, removed: false });

    // If no results found, return document not found
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    } else {
      // Extract month, week, year, and time from createdAt and updatedAt
      const creationDate = new Date(result.createdAt);
      const updateDate = new Date(result.updatedAt);

      const creationMonth = creationDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based months (0 = January)
      const updateMonth = updateDate.getMonth() + 1;

      const response = {
        success: true,
        result: {
          ...result.toObject(), // Convert Mongoose document to plain object
          creationMonth,
          updateMonth,
          creationWeek: result.week, // Assuming 'week' is already present in the result
          creationYear: result.year, // Assuming 'year' is already present in the result
          creationTime: creationDate.toLocaleTimeString(),
          updateTime: updateDate.toLocaleTimeString(),
        },
        message: 'Document found by this id: ' + req.params.id,
      };

      // Return success response
      return res.status(200).json(response);
    }
  } catch (error) {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = read;
