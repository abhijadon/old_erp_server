const { courseInfo } = require('@/models/courseInfo');

const paginatedList = async (req, res) => {
  try {
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
      .sort({ [sortBy]: parseInt(sortValue) })
      .lean();

    const count = await courseInfo.countDocuments(query);

    return res.status(200).json({
      success: true,
      result: results,
      pagination: { count, pages: 1 }, // Pagination data is static since all data is shown
      message: count > 0 ? 'Successfully found all documents' : 'No data found for the specified criteria',
    });
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
