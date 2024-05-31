const { PermissionAllowed } = require('@/models/PermissionAllowed');

const checkUserAccess = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  // Initialize base query
  req.queryFilters = { removed: false };

  // Skip permission check for admin and subadmin roles
  if (req.user.role === 'admin' || req.user.role === 'subadmin') {
    return next();
  }

  try {
    const permission = await PermissionAllowed.findOne({ userId: req.user._id })
      .populate('allowedInstitutes allowedUniversities')
      .exec();

    if (!permission) {
      return res.status(403).json({ success: false, message: 'No permissions found for this user' });
    }

    const allowedInstitutes = permission.allowedInstitutes.map(inst => inst.name);
    const allowedUniversities = permission.allowedUniversities.map(uni => uni.name);

    // Add institute and university restrictions to the query
    if (allowedUniversities.length > 0) {
      req.queryFilters.university = { $in: allowedUniversities };
    }
    if (allowedInstitutes.length > 0) {
      req.queryFilters.institute = { $in: allowedInstitutes };
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = checkUserAccess;
