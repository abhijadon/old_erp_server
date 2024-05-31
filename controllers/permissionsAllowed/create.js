const {PermissionAllowed} = require('@/models/PermissionAllowed');

const create = async (req, res) => {
  try {
    // Check if permissions for the provided userId already exist
    const existingPermissions = await PermissionAllowed.findOne({ userId: req.body.userId });

    if (existingPermissions) {
      // Permissions for the provided userId already exist
      return res.status(400).json({
        success: false,
        message: 'Permissions for the provided user already exist',
        error: null,
      });
    }

    // Create new permissions if no existing permissions found for the provided userId
    const newPermissions = new PermissionAllowed(req.body);
    const result = await newPermissions.save();

    res.status(200).json({
      success: true,
      result: result,
      message: 'Permissions created successfully',
    });
  } catch (error) {
    console.error('Error saving to the database:', error);

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

module.exports = create;
