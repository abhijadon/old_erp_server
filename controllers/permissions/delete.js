const mongoose = require('mongoose');
const Permission = mongoose.model('Permission');

const remove = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if the userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'userId is required.',
      });
    }

    // Delete permissions associated with the user
    const deletedPermissions = await Permission.findByIdAndDelete(userId);

    if (!deletedPermissions) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Permissions not found for the given userId.',
      });
    }

    return res.status(200).json({
      success: true,
      result: deletedPermissions,
      message: 'Permissions deleted successfully for the given userId.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error,
    });
  }
};

module.exports = remove;
