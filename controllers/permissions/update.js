const Permission = require('@/models/Permission');

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPermissions = req.body;

    // Update permissions associated with the provided userId
    const result = await Permission.findByIdAndUpdate(id, updatedPermissions, { new: true });

    if (!result) {
      // If no permissions found for the provided userId, return an error
      return res.status(404).json({
        success: false,
        message: 'Permissions not found',
        error: null,
      });
    }

    res.status(200).json({
      success: true,
      result: result,
      message: 'Permissions updated successfully',
    });
  } catch (error) {
    console.error('Error updating permissions:', error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

module.exports = update;
