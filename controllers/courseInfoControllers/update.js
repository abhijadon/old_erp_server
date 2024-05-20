const { courseInfo } = require('@/models/courseInfo');

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find the document by ID and update it with new data
    const result = await courseInfo.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'courseInfo not found',
      });
    }

    // Respond with the updated document
    res.status(200).json({
      success: true,
      result: result,
      message: 'courseInfo updated successfully',
    });
  } catch (error) {
    console.error('Error updating the database:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: error,
      });
    } else {
      res.status(500).json({
        success: false,
        result: null,
        message: error.message,
        error: error,
      });
    }
  }
};

module.exports = update;
