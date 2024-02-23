const Model = require('@/models/Team');

const searchTeams = async (req, res) => {
  // Check if 'q' parameter is provided in the request URL
  if (!req.query || req.query.q === undefined || req.query.q.trim() === '') {
    return res.status(202).json({
      success: false,
      result: [],
      message: 'No document found by this request',
      count: 0,
    });
  }
const query = req.query.q;

const fields = {
  $or: [
    { teamName: new RegExp(query, 'i') },
    { institute: new RegExp(query, 'i') },
    { university: new RegExp(query, 'i') },
  ],
  removed: false,
};
  try {
    let results = await Model.find(fields).limit(10);
    const count = await Model.countDocuments(fields);

 console.log('Query:', req.query.q);
 console.log('Fields:', JSON.stringify(fields, null, 2));
console.log('Results:', results);
console.log('Count:', count);

    if (results.length >= 1) {
      return res.status(200).json({
        success: true,
        result: results,
        message: `Successfully found all documents with matching '${query}'`,
        count: count,
      });
    } else {
      return res.status(202).json({
        success: false,
        result: [],
        message: `No document found with matching '${query}'`,
        count: 0,
      });
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

module.exports = searchTeams;
