const Team = require('@/models/Team');

const paginatedList = async (Model, req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = req.query.export === 'true' ? 0 : (parseInt(req.query.items) || 10);
  const skip = (page - 1) * limit;
  const { sortBy = 'updated', sortValue = -1 } = req.query;

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
          { 'customfields.institute_name': { $in: req.user.assignedInstitutes } },
          { 'customfields.university_name': { $in: req.user.assignedUniversities } }
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

    const paymentApprovedCount = await Model.countDocuments({ ...filters, 'customfields.paymentStatus': 'payment approved' });
    const paymentReceivedCount = await Model.countDocuments({ ...filters, 'customfields.paymentStatus': 'payment received' });
    const paymentRejectedCount = await Model.countDocuments({ ...filters, 'customfields.paymentStatus': 'payment rejected' });

    const pages = Math.ceil(count / limit);

    const pagination = {
      page,
      pages,
      count,
      paymentApprovedCount,
      paymentReceivedCount,
      paymentRejectedCount,
    };

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
    filters['customfields.status'] = query.status;
  }
  if (query.payment_mode) {
    filters['customfields.payment_mode'] = query.payment_mode;
  }
  if (query.payment_type) {
    filters['customfields.payment_type'] = query.payment_type;
  }
  if (query.installment_type) {
    filters['customfields.installment_type'] = query.installment_type;
  }
  if (query.paymentStatus) {
    filters['customfields.paymentStatus'] = query.paymentStatus;
  }
  if (query.userId) {
    filters.userId = query.userId;
  }
  if (query.session) {
    filters['customfields.session'] = query.session;
  }
  if (query.welcomeMail) {
    filters.welcomeMail = query.welcomeMail;
  }
  if (query.lmsStatus) {
    filters['customfields.lmsStatus'] = query.lmsStatus;
  }
  if (query.whatsappMessageStatus) {
    filters.whatsappMessageStatus = query.whatsappMessageStatus;
  }
  if (query.whatsappEnrolled) {
    filters.whatsappEnrolled = query.whatsappEnrolled;
  }
  if (query.welcomeEnrolled) {
    filters.welcomeEnrolled = query.welcomeEnrolled;
  }
  if (query.start_date && query.end_date) {
    filters.created = {
      $gte: new Date(query.start_date.split('/').reverse().join('-')),
      $lte: new Date(new Date(query.end_date.split('/').reverse().join('-')).setHours(23, 59, 59, 999)),
    };
  }
  if (query.institute_name) {
    filters['customfields.institute_name'] = query.institute_name;
  }
  if (query.university_name) {
    filters['customfields.university_name'] = query.university_name;
  }
}

module.exports = paginatedList;
