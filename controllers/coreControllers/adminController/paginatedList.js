const mongoose = require('mongoose');
const User = mongoose.model('User');

const paginatedList = async (req, res) => {
  try {
    const { sortBy = 'enabled', sortValue = 1, q, filter, equal } = req.query;

    // Build the initial query object
    let query = { removed: false, enabled: true };

    // If q is provided, search across all string fields dynamically
    if (q) {
      const schemaPaths = Object.keys(User.schema.paths);
      const stringFields = schemaPaths.filter(field => User.schema.paths[field].instance === 'String');
      query.$or = stringFields.map(field => ({ [field]: { $regex: new RegExp(q, 'i') } }));
    }

    // Convert filter and equal to arrays if they are not already
    const filters = Array.isArray(filter) ? filter : filter ? [filter] : [];
    const equals = Array.isArray(equal) ? equal : equal ? [equal] : [];

    // Add filter and equal if provided
    if (filters.length === equals.length) {
      filters.forEach((filt, index) => {
        if (equals[index]) {
          query[filt] = equals[index];
        }
      });
    }

    // Fetch results with sorting
    const resultsPromise = User.find(query)
      .sort({ [sortBy]: parseInt(sortValue) })
      .lean()
      .exec();

    // Count total documents
    const countPromise = User.countDocuments(query).exec();

    // Resolve both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    // Response without pagination information
    return res.status(200).json({
      success: true,
      result,
      count,
      message: count > 0 ? 'Successfully found all documents' : 'No data found for the specified criteria',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: [],
      message: error.message,
      error,
    });
  }
};

module.exports = paginatedList;
