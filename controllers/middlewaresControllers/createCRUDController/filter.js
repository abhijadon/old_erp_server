const mongoose = require('mongoose');
const User = require('@/models/User'); // Ensure the User model is imported

const filter = async (Model, req, res) => {
  try {
    const uniqueValues = await getUniqueValues(Model);

    return res.status(200).json({
      success: true,
      uniqueValues: uniqueValues,
      message: "Successfully retrieved unique values for the specified fields",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

const getUniqueValues = async (Model) => {
  const uniqueValues = {};

  uniqueValues.university_names = await Model.distinct('customfields.university_name', { removed: false });
  uniqueValues.institute_names = await Model.distinct('customfields.institute_name', { removed: false });
  uniqueValues.sessions = await Model.distinct('customfields.session', { removed: false });
  uniqueValues.statuses = await Model.distinct('customfields.status', { removed: false });
  uniqueValues.installment_types = await Model.distinct('customfields.installment_type', { removed: false });
  uniqueValues.payment_types = await Model.distinct('customfields.payment_type', { removed: false });
  uniqueValues.payment_modes = await Model.distinct('customfields.payment_mode', { removed: false });

  // Fetch distinct userIds and populate them
  const userIds = await Model.distinct('userId', { removed: false });
  const users = await User.find({ _id: { $in: userIds } }).select('_id fullname');

  uniqueValues.userIds = users.map(user => ({ value: user._id, label: user.fullname }));

  return uniqueValues;
};

module.exports = filter;
