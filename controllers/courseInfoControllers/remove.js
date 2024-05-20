const { courseInfo } = require('@/models/courseInfo');

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the document by ID and delete it
    const result = await courseInfo.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'courseInfo not found',
      });
    }

    // Respond with a success message
    res.status(200).json({
      success: true,
      result: result,
      message: 'courseInfo deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting from the database:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = remove;
