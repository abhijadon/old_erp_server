const { courseInfo } = require('@/models/courseInfo');

const paginatedList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 20;
    const skip = (page - 1) * limit;

    const { sortBy = 'enabled', sortValue = -1, fields, q } = req.query;
    let { filter, equal } = req.query;

    // Build the initial query object
    let query = { removed: false };

    // Build fields object for regex search if fields and q are provided
    if (fields && q) {
      const fieldsArray = fields.split(',');
      query.$or = fieldsArray.map(field => ({ [field]: { $regex: new RegExp(q, 'i') } }));
    }

    // Convert filter and equal to arrays if they are not already
    if (!Array.isArray(filter)) filter = [filter];
    if (!Array.isArray(equal)) equal = [equal];

    // Add filter and equal if provided
    if (filter && equal && filter.length === equal.length) {
      filter.forEach((filt, index) => {
        if (equal[index]) {
          query[filt] = equal[index];
        }
      });
    }

    // Fetch results with pagination, sorting, and population
    const resultsPromise = courseInfo.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: parseInt(sortValue) })
      .lean() // Return plain JavaScript objects instead of Mongoose documents for efficiency
      .exec();

    // Count total documents
    const countPromise = courseInfo.countDocuments(query).exec();

    // Resolve both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    // Calculate total pages
    const pages = Math.ceil(count / limit);

    // Pagination information
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
      message: 'An error occurred while fetching data',
      error: error.message,
    });
  }
};

module.exports = paginatedList;
