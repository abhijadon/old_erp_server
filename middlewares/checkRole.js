const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure req.user is defined
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user data found" });
    }

    const userRole = req.user.role; // Assuming req.user has a 'role' property
    
    if (allowedRoles.includes(userRole)) {
      return next(); // User has the correct role, allow access
    } else {
      return res.status(403).json({ success: false, message: "Access denied: Insufficient permissions" }); // User does not have access
    }
  };
};

module.exports = { checkRole };
