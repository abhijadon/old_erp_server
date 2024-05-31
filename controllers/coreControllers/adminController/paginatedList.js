const mongoose = require('mongoose');
const User = mongoose.model('User'); // Changed 'Admin' to 'User' to be consistent with the model name

const paginatedList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page - 1) * limit;
    const { sortBy = 'enabled', sortValue = 1, q } = req.query;
    let { filter, equal } = req.query;

    // Build the initial query object
    let query = { removed: false, enabled: true };

    // If q is provided, search across all string fields dynamically
    if (q) {
      const schemaPaths = Object.keys(User.schema.paths); // Changed 'Model' to 'User'
      const stringFields = schemaPaths.filter(field => User.schema.paths[field].instance === 'String'); // Changed 'Model' to 'User'
      query.$or = stringFields.map(field => ({ [field]: { $regex: new RegExp(q, 'i') } }));
    }

    // Convert filter and equal to arrays if they are not already
    if (filter && !Array.isArray(filter)) filter = [filter];
    if (equal && !Array.isArray(equal)) equal = [equal];

    // Add filter and equal if provided
    if (filter && equal && filter.length === equal.length) {
      filter.forEach((filt, index) => {
        if (equal[index]) {
          query[filt] = equal[index];
        }
      });
    }

    // Fetch results with sorting and population
    const resultsPromise = User.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: parseInt(sortValue) })
      .lean() // Return plain JavaScript objects instead of Mongoose documents for efficiency
      .exec();

    // Count total documents
    const countPromise = User.countDocuments(query).exec();

    // Resolve both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    // Calculate total pages
    const pages = Math.ceil(count / limit);

    // Pagination information (count of total documents)
    const pagination = { page, pages, count };

    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(200).json({
        success: true,
        result: [],
        pagination,
        message: 'No data found for the specified criteria',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: [],
      message: error.message,
      error: error,
    });
  }
};

module.exports = paginatedList;
