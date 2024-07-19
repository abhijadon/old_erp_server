const { courseInfo } = require('@/models/courseInfo');

const paginatedList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.export === 'true' ? 0 : (parseInt(req.query.items) || 10);
    const skip = (page - 1) * limit;
    const { sortBy = 'enabled', sortValue = -1, q } = req.query;
     
    let query = { ...req.queryFilters };

    if (q) {
      const schemaPaths = Object.keys(courseInfo.schema.paths);
      const stringFields = schemaPaths.filter(field => courseInfo.schema.paths[field].instance === 'String');
      query.$or = stringFields.map(field => ({ [field]: { $regex: new RegExp(`^${q}`, 'i') } }));
    }

    const filterField = req.query.filterField;
    const filterValue = req.query.filterValue;

    if (filterField && filterValue) {
      const fields = Array.isArray(filterField) ? filterField : [filterField];
      const values = Array.isArray(filterValue) ? filterValue : [filterValue];

      fields.forEach((field, index) => {
        query[field] = values[index];
      });
    }

    const results = await courseInfo.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: parseInt(sortValue) })
      .lean();

    const count = await courseInfo.countDocuments(query);

    const pagination = { page, count, pages: Math.ceil(count / limit) };

    if (count > 0) {
      return res.status(200).json({
        success: true,
        result: results,
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
    console.error('Error in paginatedList:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching data',
      error: error.message,
    });
  }
};

module.exports = paginatedList;
