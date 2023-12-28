const search = async (Model, req, res) => {
  if (req.query.q === undefined || req.query.q.trim() === '') {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'No document found by this request',
        count: 0, // Add count property with value 0
      })
      .end();
  }

  // Specify the fields you want to search in
  const searchFields = [
    { field: 'customfields.counselor_email', message: 'Counselor Email' },
    { field: 'contact.email', message: 'Contact Email' },
    { field: 'contact.phone', message: 'Contact Phone', type: 'number' },
    { field: 'full_name', message: 'Full Name' },
    { field: 'lead_id', message: 'Lead ID' },
    { field: 'customfields.institute_name', message: 'Institute Name' },
    { field: 'customfields.university_name', message: 'University Name' },
  ];

  const fields = { $or: [] };

  // Build the $or condition for each search field
  for (const { field, message, type } of searchFields) {
    if (type === 'number' && isNaN(Number(req.query.q))) {
      continue; // Skip the field if it's expected to be a number, but the search term is not a valid number
    }

    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  try {
    // Fetch documents based on the specified fields
    let results = await Model.find(fields).where('removed', false).limit(10);

    const count = await Model.countDocuments(fields).where('removed', false);

    if (results.length >= 1) {
      return res.status(200).json({
        success: true,
        result: results,
        message: `Successfully found all documents in ${searchFields
          .filter(({ field }) => fields.$or.some((condition) => condition[field]))
          .map(({ message }) => message)
          .join(', ')}`,
        count: count, // Include the count in the response
      });
    } else {
      return res
        .status(202)
        .json({
          success: false,
          result: [],
          message: 'No document found by this request',
          count: 0, // Set count to 0 when no documents are found
        })
        .end();
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
      count: 0, // Set count to 0 in case of an error
    });
  }
};

module.exports = search;
