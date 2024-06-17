const Team = require('@/models/Team');
const mongoose = require('mongoose');

const paginatedList = async (Model, req, res) => {
  try {
    const user = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page - 1) * limit;
    const {
      instituteName,
      universityName,
      status,
      session,
      welcomeEnrolled,
      paymentMode,
      installMent,
      counsellor,
      startDate,
      welcomeMail,
      whatsappMessageStatus,
      whatsappEnrolled,
      lmsStatus,
      endDate,
      paymentStatus
    } = req.query;

    const { sortBy = 'enabled', sortValue = -1 } = req.query;

    // Handle search (text search across specified fields)
    const searchQuery = {};
    if (req.query.q && req.query.fields) {
      const fieldsArray = req.query.fields.split(',');
      const regex = new RegExp(req.query.q, 'i');
      searchQuery.$or = fieldsArray.map(field => ({ [field]: regex }));
    }

    const userId = req.query.userId;

    // Build the initial query object
    // filters query 
    let query = { removed: false };
    if (instituteName) query['customfields.institute_name'] = instituteName;
    if (universityName) query['customfields.university_name'] = universityName;
    if (status) query['customfields.status'] = status;
    if (session) query['customfields.session'] = session;
    if (paymentMode) query['customfields.payment_mode'] = paymentMode;
    if (welcomeMail) query.welcomeMail = welcomeMail;
    if (whatsappEnrolled) query.whatsappEnrolled = whatsappEnrolled;
    if (lmsStatus) query['customfields.lmsStatus'] = lmsStatus;
    if (welcomeEnrolled) query.welcomeEnrolled = welcomeEnrolled;
    if (whatsappMessageStatus) query.whatsappMessageStatus = whatsappMessageStatus;
    if (installMent) query['customfields.installment_type'] = installMent;
    if (paymentStatus) query['customfields.paymentStatus'] = paymentStatus;
    if (counsellor) {
      query.userId = mongoose.Types.ObjectId(counsellor);
    }
    if (startDate && endDate) {
      query.created = {
        $gte: new Date(startDate),
        $lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)), // End date is exclusive, so increment by 1 day
      };
    } else if (startDate) {
      query.created = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.created = { $lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) }; // End date is exclusive
    }

    // filters query 

    if (userId) {
      const team = await Team.findOne({ userId }).populate('teamMembers');
      if (team) {
        const userIds = team.teamMembers.map(member => member._id.toString());
        userIds.push(team.userId.toString());
        query['userId'] = { $in: userIds };
      } else {
        return res.status(200).json({
          success: true,
          result: [],
          pagination: { page, pages: 0, count: 0 },
          message: 'No data found for the specified user',
        });
      }
    } else {
      if (user.role === 'manager') {
        const team = await Team.findOne({ userId: user._id }).populate('teamMembers');
        if (team) {
          const instituteNames = team.institute;
          const universityNames = team.university;
          query['customfields.institute_name'] = { $in: instituteNames };
          query['customfields.university_name'] = { $in: universityNames };
          query['institute_name'] = { $in: instituteNames };
          query['university_name'] = { $in: universityNames };
        } else {
          query['userId'] = null;
        }
      } else if (user.role === 'supportiveassociate') {
        const team = await Team.findOne({ userId: user._id }).populate('teamMembers');
        if (team) {
          const teamMemberIds = team.teamMembers.map(member => member._id.toString());
          query['userId'] = { $in: [user._id.toString(), ...teamMemberIds] };
          query['customfields.institute_name'] = { $in: team.institute };
          query['customfields.university_name'] = { $in: team.university };
          query['institute_name'] = { $in: team.institute };
          query['university_name'] = { $in: team.university };
        } else {
          query['userId'] = null;
        }
      } else if (user.role === 'teamleader') {
        const team = await Team.findOne({ userId: user._id }).populate('teamMembers');
        if (team) {
          const teamMemberIds = team.teamMembers.map(member => member._id.toString());
          query['userId'] = { $in: [user._id.toString(), ...teamMemberIds] };
        } else {
          query['userId'] = null;
        }
      } else if (user.role === 'admin' || user.role === 'subadmin') {
        // Admin and subadmin can see all data, no restrictions
      } else {
        query['userId'] = user._id.toString();
      }
    }

    // Merge filters and search queries into the main query object
    query = {
      ...query,
      ...searchQuery,
    };
    // Count documents matching the paymentStatus
    const buildCountQuery = (statusQuery) => {
      const countQuery = { ...query, ...statusQuery };
      return Model.countDocuments(countQuery);
    };
    const countReceivedPromise = buildCountQuery({ 'customfields.paymentStatus': 'payment received' });
    const countRejectedPromise = buildCountQuery({ 'customfields.paymentStatus': 'payment rejected' });
    const countApprovedPromise = buildCountQuery({ 'customfields.paymentStatus': 'payment approved' });

    const resultsPromise = Model.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortValue })
      .populate('userId')
      .exec();

    const countPromise = Model.countDocuments(query);

    const [result, count, countReceived, countRejected, countApproved] = await Promise.all([resultsPromise, countPromise, countReceivedPromise,
      countRejectedPromise,
      countApprovedPromise]);
    const pages = Math.ceil(count / limit);

    const pagination = { page, pages, count };

    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        countReceived,
        countRejected,
        countApproved,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: true,
        result: [],
        pagination,
        countReceived,
        countRejected,
        countApproved,
        message: 'Collection is Empty',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: [],
      message: error.message,
      error,
    });
  }
};

module.exports = paginatedList;