const Team = require('@/models/Team');

const paginatedList = async (Model, req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = req.query.export === 'true' ? 0 : parseInt(req.query.items) || 10;
  const skip = (page - 1) * limit;
  const { sortBy = 'created', sortValue = -1 } = req.query;

  let filters = { removed: false };

  try {
    // Apply role-based filters first
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
          { 'customfields.institute_name': { $in: req.user.assignedInstitutes } },
          { 'customfields.university_name': { $in: req.user.assignedUniversities } },
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

    // Create regex for search across specified fields or all fields
    const regex = new RegExp(req.query.q, 'i');
    if (req.query.q) {
      if (req.query.fields) {
        const fieldsArray = req.query.fields.split(',');
        filters.$and = filters.$and || [];
        filters.$and.push({
          $or: fieldsArray.map((field) => ({ [field]: { $regex: regex } })),
        });
      } else {
        filters.$and = filters.$and || [];
        filters.$and.push({
          $or: [
            { 'customfields.status': { $regex: regex } },
            { 'customfields.payment_mode': { $regex: regex } },
            { 'customfields.payment_type': { $regex: regex } },
            { 'customfields.installment_type': { $regex: regex } },
            { 'customfields.paymentStatus': { $regex: regex } },
            { 'customfields.session': { $regex: regex } },
            { 'customfields.enrollment': { $regex: regex } },
            { 'customfields.institute_name': { $regex: regex } },
            { 'customfields.university_name': { $regex: regex } },
            { 'contact.email': { $regex: regex } },
            { 'contact.phone': { $regex: regex } },
            { full_name: { $regex: regex } },
            { lead_id: { $regex: regex } },
          ],
        });
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
    const paymentApprovedCount = await Model.countDocuments({
      ...filters,
      'customfields.paymentStatus': 'payment approved',
    });
    const paymentReceivedCount = await Model.countDocuments({
      ...filters,
      'customfields.paymentStatus': 'payment received',
    });
    const paymentRejectedCount = await Model.countDocuments({
      ...filters,
      'customfields.paymentStatus': 'payment rejected',
    });

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
    const statusArray = query.status.split(',');
    filters['customfields.status'] = { $in: statusArray };
  }
  if (query.payment_mode) {
    const paymentModeArray = query.payment_mode.split(',');
    filters['customfields.payment_mode'] = { $in: paymentModeArray };
  }
  if (query.payment_type) {
    const paymentTypeArray = query.payment_type.split(',');
    filters['customfields.payment_type'] = { $in: paymentTypeArray };
  }
  if (query.installment_type) {
    const installmentTypeArray = query.installment_type.split(',');
    filters['customfields.installment_type'] = { $in: installmentTypeArray };
  }
  if (query.paymentStatus) {
    const paymentStatusArray = query.paymentStatus.split(',');
    filters['customfields.paymentStatus'] = { $in: paymentStatusArray };
  }
  if (query.userId) {
    const userIdArray = query.userId.split(',');
    filters.userId = { $in: userIdArray };
  }
  if (query.session) {
    const sessionArray = query.session.split(',');
    filters['customfields.session'] = { $in: sessionArray };
  }
  if (query.welcomeMail) {
    const welcomeMailArray = query.welcomeMail.split(',');
    filters.welcomeMail = { $in: welcomeMailArray };
  }
  if (query.lmsStatus) {
    const lmsStatusArray = query.lmsStatus.split(',');
    filters['customfields.lmsStatus'] = { $in: lmsStatusArray };
  }
  if (query.whatsappMessageStatus) {
    const whatsappMessageStatusArray = query.whatsappMessageStatus.split(',');
    filters.whatsappMessageStatus = { $in: whatsappMessageStatusArray };
  }
  if (query.whatsappEnrolled) {
    const whatsappEnrolledArray = query.whatsappEnrolled.split(',');
    filters.whatsappEnrolled = { $in: whatsappEnrolledArray };
  }
  if (query.welcomeEnrolled) {
    const welcomeEnrolledArray = query.welcomeEnrolled.split(',');
    filters.welcomeEnrolled = { $in: welcomeEnrolledArray };
  }
  if (query.start_date && query.end_date) {
    filters.created = {
      $gte: new Date(query.start_date.split('/').reverse().join('-')),
      $lte: new Date(
        new Date(query.end_date.split('/').reverse().join('-')).setHours(23, 59, 59, 999)
      ),
    };
  }

  // Apply .split() for institute_name and university_name as well
  if (query.institute_name) {
    const instituteArray = query.institute_name.split(',');
    filters['customfields.institute_name'] = { $in: instituteArray };
  }
  if (query.university_name) {
    const universityArray = query.university_name.split(',');
    filters['customfields.university_name'] = { $in: universityArray };
  }
}

module.exports = paginatedList;
