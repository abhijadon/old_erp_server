const search = async (Model, req, res) => {
  if (req.query.q === undefined || req.query.q.trim() === '') {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'No document found by this request',
        count: 0,
      })
      .end();
  }

  const isPhoneNumber = /^\+?\d+$/.test(req.query.q);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.query.q);

  const searchFields = [
    { field: 'customfields.counselor_email', message: 'Counselor Email' },
    { field: 'contact.email', message: 'Contact Email' },
    { field: 'contact.phone', message: 'Contact Phone' },
    { field: 'full_name', message: 'Full Name' },
    { field: 'lead_id', message: 'Lead ID' },
    { field: 'customfields.institute_name', message: 'Institute Name' },
    { field: 'customfields.university_name', message: 'University Name' },
  ];

  const fields = { $or: [] };

  for (const { field } of searchFields) {
    if (isPhoneNumber && field === 'contact.phone') {
      fields.$or.push({ [field]: req.query.q });
    } else if (isEmail && field === 'contact.email') {
      fields.$or.push({ [field]: req.query.q });
    }
  }

  try {
    let results = await Model.find(fields).where('removed', false).limit(10);
    const count = await Model.countDocuments(fields).where('removed', false);

    if (results.length >= 1) {
      return res.status(200).json({
        success: true,
        result: results,
        message: `Successfully found all documents in ${searchFields
          .map(({ message }) => message)
          .join(', ')}`,
        count: count,
      });
    } else {
      return res
        .status(202)
        .json({
          success: false,
          result: [],
          message: 'No document found by this request',
          count: 0,
        })
        .end();
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
      count: 0,
    });
  }
};

module.exports = search;
