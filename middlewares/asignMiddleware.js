const User = require('@/models/User');
const Institute = require('@/models/Institute');

const filterAssignedInstitutes = async (req, res, next) => {
  try {
    // Get the user ID from the request
    const userId = req.user._id; // Assuming the user object is available in the request

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Fetch assigned institutes for the user
    const assignedInstitutes = await Institute.find({ _id: { $in: user.assignedInstitutes } });

    // If no institutes are assigned to the user, return an empty array
    if (assignedInstitutes.length === 0) {
      return res.status(403).json({ success: false, message: 'You are not assigned to any institutes.' });
    }

    // Add the filtered institutes to the request object
    req.filteredInstitutes = assignedInstitutes;

    // Log the filtered institutes to the console
    console.log('Filtered Institutes:', assignedInstitutes);

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = filterAssignedInstitutes;
