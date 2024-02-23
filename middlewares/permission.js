//this middleware will check if the user has permission

const roles = {
  admin: ['create', 'read', 'update', 'delete', 'download', 'upload'],
  subadmin: ['create', 'read', 'update', 'delete', 'download', 'upload'],
  teamleader: ['create', 'read', 'update', 'download', 'upload'],
  user: ['create', 'read'],

};
exports.roles = roles;
exports.hasPermission = (permissionName = 'all') => {
  return function (req, res, next) {
    const currentUserRole = req.admin.role;

    if (roles[currentUserRole].includes(permissionName) || req.admin.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Access denied : you are not granted permission.',
      });
    }
  };
};
