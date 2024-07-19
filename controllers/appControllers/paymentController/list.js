const mongoose = require('mongoose');
const Model = mongoose.model('Payment'); // Adjust the path according to your project structure
const Team = require('@/models/Team');

const paginatedList = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = req.query.export === 'true' ? 0 : (parseInt(req.query.items) || 10);
  const skip = (page - 1) * limit;
  const { sortBy = 'updatedAt', sortValue = -1 } = req.query;

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];
  let fields = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  let filters = { removed: false, ...fields };

   try {
    if (req.user.isAdmin || req.user.role === 'subadmin') {
      if (req.query.team === 'true' && req.query.teamLeader) {
        const teamLeaderId = req.query.teamLeader;
        const team = await Team.findOne({ userId: teamLeaderId }).populate('teamMembers');

        if (team) {
          const teamMemberIds = team.teamMembers.map(member => member._id);
          filters.$or = [
            { userId: teamLeaderId },
            { userId: { $in: teamMemberIds } }
          ];
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
          { university_name: { $in: req.user.assignedUniversities } }
        ];
        if (req.user.isSupportiveAssociate && !req.user.isTeamLeader) {
          filters.$and.push({ userId: { $in: [req.user._id, ...req.user.teamMembers] } });
        }
      } else if (req.user.isTeamLeader) {
        const team = await Team.findOne({ userId: req.user._id }).populate('teamMembers');

        if (team) {
          const teamMemberIds = team.teamMembers.map(member => member._id);
          filters.$or = [
            { userId: req.user._id },
            { userId: { $in: teamMemberIds } }
          ];
        } else {
          filters.userId = req.user._id;
        }
      } else {
        filters.userId = req.user._id;
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

   const followUpCount = await Model.countDocuments({ ...filters, 'followStatus': 'follow-up' });

    const pagination = { page, pages, count, followUpCount};

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
    filters.status = query.status;
  }
  if (query.payment_mode) {
    filters.payment_mode = query.payment_mode;
  }
  if (query.payment_type) {
    filters.payment_type = query.payment_type;
  }
  if (query.userId) {
    filters.userId = query.userId;
  }
  if (query.followup) {
    filters.followStatus = query.followup;
  }
  if (query.followupdate_start && query.followupdate_end) {
    filters.followUpDate = {
      $gte: new Date(query.followupdate_start.split('/').reverse().join('-')),
      $lte: new Date(query.followupdate_end.split('/').reverse().join('-')).setHours(23, 59, 59, 999),
    };
  }
  if (query.session) {
    filters.session = query.session;
  }
  if (query.start_date && query.end_date) {
    filters.created = {
      $gte: new Date(query.start_date.split('/').reverse().join('-')),
      $lte: new Date(new Date(query.end_date.split('/').reverse().join('-')).setHours(23, 59, 59, 999)),
    };
  }
  if (query.institute_name) {
    filters.institute_name = query.institute_name;
  }
  if (query.university_name) {
    filters.university_name = query.university_name;
  }
}


module.exports = paginatedList;
