const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const paginatedList = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = (page - 1) * limit;

  try {
    const [results, count] = await Promise.all([
      Admin.find({ removed: false })
        .skip(skip)
        .limit(limit)
        .sort({ created: 'desc' })
        .populate()
        .exec(),
      Admin.countDocuments({ removed: false }),
    ]);

    const totalPages = Math.ceil(count / limit);
    const pagination = { page, totalPages, totalItems: count };

    if (results.length > 0) {
      results.forEach((admin) => {
        admin.password = undefined;
        admin.loggedSessions = undefined;
      });

      return res.status(200).json({
        success: true,
        results,
        pagination,
        message: 'Successfully found documents',
      });
    } else {
      return res.status(204).json({
        success: true,
        results: [],
        pagination,
        message: 'Collection is Empty',
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, results: [], message: error.message });
  }
};

module.exports = paginatedList;
