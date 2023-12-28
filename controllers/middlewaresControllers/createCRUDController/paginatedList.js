const paginatedList = async (Model, req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  // Extract filter conditions from request query
  const { status, university_name, institute_name, counselor_email, session } = req.query;

  // Construct the filter object based on provided conditions
  const filter = {
    removed: false,
    // Add more conditions as needed
    ...(status && { 'customfields.status': status }),
    ...(university_name && { 'customfields.university_name': university_name }),
    ...(institute_name && { 'customfields.institute_name': institute_name }),
    ...(counselor_email && { 'customfields.counselor_email': counselor_email }),
    ...(session && { 'customfields.session': session }),
  };

  try {
    // Query the database for a list of results based on filter conditions
    const resultsPromise = Model.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ created: 'desc' })
      .populate();

    // Counting the total documents based on filter conditions
    const countPromise = Model.countDocuments(filter);

    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    // Calculating total pages
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };

    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found matching documents',
      });
    } else {
      return res.status(203).json({
        success: true,
        result: [],
        pagination,
        message: 'No matching documents found',
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
