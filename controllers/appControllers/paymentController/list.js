const mongoose = require('mongoose');
const Model = mongoose.model('Payment'); // Adjust the path according to your project structure
const Team = require('@/models/Team');

const paginatedList = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = req.query.export === 'true' ? 0 : parseInt(req.query.items) || 10;
  const skip = (page - 1) * limit;
  const { sortBy = 'updatedAt', sortValue = -1, q } = req.query;

  let filters = { removed: false };

  try {
    if (req.user.isAdmin || req.user.role === 'subadmin') {
      if (req.query.team === 'true' && req.query.teamLeader) {
        const teamLeaderId = req.query.teamLeader;
        const team = await Team.findOne({ userId: teamLeaderId }).populate('teamMembers');

        if (team) {
          const teamMemberIds = team.teamMembers.map((member) => member._id);
          filters.$or = [{ userId: teamLeaderId }, { userId: { $in: teamMemberIds } }];
        } else {
          filters.userId = teamLeaderId;
        }
      } else if (req.query.team === 'false' && req.query.teamLeader) {
        filters.userId = req.query.teamLeader;
      }
    } else {
      if (req.user.isManager || req.user.isSupportiveAssociate) {
        filters.$and = [
          { institute_name: { $in: req.user.assignedInstitutes } },
          { university_name: { $in: req.user.assignedUniversities } },
        ];
        if (req.user.isSupportiveAssociate && !req.user.isTeamLeader) {
          filters.$and.push({ userId: { $in: [req.user._id, ...req.user.teamMembers] } });
        }
      } else if (req.user.isTeamLeader) {
        const team = await Team.findOne({ userId: req.user._id }).populate('teamMembers');

        if (team) {
          const teamMemberIds = team.teamMembers.map((member) => member._id);
          filters.$or = [{ userId: req.user._id }, { userId: { $in: teamMemberIds } }];
        } else {
          filters.userId = req.user._id;
        }
      } else {
        filters.userId = req.user._id;
      }
    }

    if (req.query.q) {
      const regex = new RegExp(req.query.q, 'i'); // Case-insensitive regex for strings
      filters.$or = [];

      if (!isNaN(req.query.q)) {
        // If q is a number, search numeric fields
        filters.$or.push({ phone: parseInt(req.query.q) });
        filters.$or.push({ lead_id: parseInt(req.query.q) });
      } else {
        // If q is a string, search string fields
        filters.$or.push({ email: { $regex: regex } });
        filters.$or.push({ student_name: { $regex: regex } });
      }
    }

    applyAdditionalFilters(req.query, filters);

    const resultsPromise = Model.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortValue })
      .populate('userId')
      .exec();

    const countPromise = Model.countDocuments(filters);
    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    const followUpCount = await Model.countDocuments({ ...filters, followStatus: 'follow-up' });
    const pagination = { page, pages, count, followUpCount };

    // Aggregation for summary
    const summaryResult = await Model.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          total_course_fee: { $sum: '$total_course_fee' },
          total_paid_amount: { $sum: '$total_paid_amount' },
          paid_amount: { $sum: '$paid_amount' },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          total_paid_amount: 1,
          paid_amount: 1,
          due_amount: { $subtract: ['$total_course_fee', '$total_paid_amount'] },
          total_course_fee: 1,
        },
      },
    ]);

    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        summaryResult: summaryResult[0], // Return only the first element of the summaryResult array
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(200).json({
        success: true,
        result: [],
        pagination,
        message: 'No matching data found',
      });
    }
  } catch (error) {
    console.error('Error in paginatedList:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

function applyAdditionalFilters(query, filters) {
  if (query.status) {
    filters.status = { $in: query.status.split(',') };
  }
  if (query.payment_mode) {
    filters.payment_mode = { $in: query.payment_mode.split(',') };
  }
  if (query.payment_type) {
    filters.payment_type = { $in: query.payment_type.split(',') };
  }
  if (query.userId) {
    filters.userId = { $in: query.userId.split(',') };
  }
  if (query.followup) {
    filters.followStatus = { $in: query.followup.split(',') };
  }
  if (query.followupdate_start && query.followupdate_end) {
    filters.followUpDate = {
      $gte: new Date(query.followupdate_start.split('/').reverse().join('-')),
      $lte: new Date(query.followupdate_end.split('/').reverse().join('-')).setHours(
        23,
        59,
        59,
        999
      ),
    };
  }
  if (query.session) {
    filters.session = { $in: query.session.split(',') };
  }
  if (query.start_date && query.end_date) {
    filters.created = {
      $gte: new Date(query.start_date.split('/').reverse().join('-')),
      $lte: new Date(
        new Date(query.end_date.split('/').reverse().join('-')).setHours(23, 59, 59, 999)
      ),
    };
  }
  if (query.institute_name) {
    filters.institute_name = { $in: query.institute_name.split(',') };
  }
  if (query.university_name) {
    filters.university_name = { $in: query.university_name.split(',') };
  }
}

module.exports = paginatedList;
