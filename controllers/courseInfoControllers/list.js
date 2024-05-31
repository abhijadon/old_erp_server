const { courseInfo } = require('@/models/courseInfo');

const paginatedList = async (req, res) => {
  try {
    const { sortBy = 'enabled', sortValue = -1, q } = req.query;
    let { filter, equal } = req.query;

    // Use the queryFilters prepared by the middleware
    let query = { ...req.queryFilters };

    // If q is provided, search across all string fields dynamically
    if (q) {
      const schemaPaths = Object.keys(courseInfo.schema.paths);
      const stringFields = schemaPaths.filter(field => courseInfo.schema.paths[field].instance === 'String');
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
    const results = await courseInfo.find(query)
      .sort({ [sortBy]: parseInt(sortValue) }) // Sorting based on sortBy and sortValue
      .lean(); // Return plain JavaScript objects instead of Mongoose documents for efficiency

    // Count total documents
    const count = await courseInfo.countDocuments(query);

    // Pagination information (count of total documents)
    const pagination = { count };

    if (count > 0) {
      let message = 'Successfully found all documents';
      if (sortBy !== 'enabled') {
        message += ' and sorted the results';
      }
      return res.status(200).json({
        success: true,
        result: results,
        pagination,
        message,
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
      message: 'An error occurred while fetching data',
      error: error.message,
    });
  }
};

module.exports = paginatedList;
