const Permission = require('@/models/Permission');

exports.hasPermission = (permissionName = 'none') => {
  return async function (req, res, next) {
    try {
      const currentUserPermissions = await Permission.findOne({
        userId: req.user._id, // Change 'user' to 'userId' to match the schema
      });

      if (
        currentUserPermissions &&
        currentUserPermissions.permissions.includes(permissionName)
      ) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          result: null,
          message: 'Access denied: You are not granted permission.',
        });
      }
    } catch (error) {
      console.error('Permission error:', error);
      res.status(500).json({
        success: false,
        result: null,
        message: 'Internal server error. Please try again later.',
        error: error.message,
      });
    }
  };
};
