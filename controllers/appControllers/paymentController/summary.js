const mongoose = require('mongoose');
const moment = require('moment');

const Model = mongoose.model('Payment');

const summary = async (req, res) => {
  try {
    const {
      payment_type,
      payment_mode,
      institute_name,
      university_name,
      status,
      year,
      month,
      userId,
      week,
      startDate,
      endDate,
    } = req.query;

    const matchQuery = { removed: false };

    if (startDate && endDate) {
      matchQuery.created = {
        $gte: new Date(startDate), // Greater than or equal to startDate
        $lt: new Date(endDate),    // Less than endDate
      };
    } else if (startDate) {
      matchQuery.created = { $gte: new Date(startDate) };
    } else if (endDate) {
      matchQuery.created = { $lt: new Date(endDate) };
    }

    if (year) {
      matchQuery.year = parseInt(year, 10);
    }

    if (month) {
      matchQuery.month = parseInt(month, 10);
    }

    if (week) {
      matchQuery.week = parseInt(week, 10);
    }

    if (institute_name) {
      matchQuery.institute_name = institute_name;
    }

    if (payment_mode) {
      matchQuery.payment_mode = payment_mode;
    }

    if (university_name) {
      matchQuery.university_name = university_name;
    }

    if (payment_type) {
      matchQuery.payment_type = payment_type;
    }

    if (status) {
      matchQuery.status = status;
    }

    if (userId) {
      // Assuming userId is the ObjectID, if not, adjust accordingly
      matchQuery.userId = mongoose.Types.ObjectId(userId);
    }

    const result = await Model.aggregate([
      { $match: matchQuery },
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

    const universityData1 = [
      'University',
      'SPU',
      'LPU',
      'UPES',
      'SGVU',
      'CU',
      'AMRITA',
      'AMITY',
      'UU',
      'JAIN',
      'DPU',
      'SVSU',
      'VIGNAN',
      'MANIPAL',
      'SMU',
      'HU',
      'BOSSE',
      'MANGALAYATAN DISTANCE',
      'MANGALAYATAN ONLINE',
    ];

    const universitySpecificData = [];
    let countDataUniversity = 0;

    for (const university of universityData1) {
      const data = await Model.aggregate([
        {
          $match: {
            removed: false,
            university_name: university === 'University' ? { $exists: true } : university,
            ...matchQuery,
          },
        },
        {
          $group: {
            _id: university,
            count: { $sum: 1 },
            totalStudents: { $sum: '$students' },
            total_paid_amount: { $sum: '$total_paid_amount' },
            paid_amount: { $sum: '$paid_amount' },
          },
        },
        {
          $project: {
            _id: 1,
            count: 1,
            totalStudents: 1,
            total_paid_amount: 1,
            paid_amount: 1,
            due_amount: { $subtract: ['$total_course_fee', '$total_paid_amount'] },
          },
        },
      ]);

      universitySpecificData.push(data);
      countDataUniversity += data.length > 0 ? data[0].count : 0;
    }

    const instituteData1 = ['Institute', 'HES', 'DES'];
    const instituteSpecificData = [];
    let countInstitute = 0;

    for (const institute of instituteData1) {
      const data = await Model.aggregate([
        {
          $match: {
            removed: false,
            institute_name: institute === 'Institute' ? { $exists: true } : institute,
            ...matchQuery,
          },
        },
        {
          $group: {
            _id: institute,
            count: { $sum: 1 },
            totalStudents: { $sum: '$students' },
            total_paid_amount: { $sum: '$total_paid_amount' },
            paid_amount: { $sum: '$paid_amount' },
          },
        },
        {
          $project: {
            _id: 1,
            count: 1,
            totalStudents: 1,
            total_paid_amount: 1,
            paid_amount: 1,
            due_amount: { $subtract: ['$total_course_fee', '$total_paid_amount'] },
          },
        },
      ]);

      instituteSpecificData.push(data);
      countInstitute += data.length > 0 ? data[0].count : 0;
    }

    const statusData1 = ['Total', 'New', 'Cancel', 'Alumini', 'Enrolled', 'Approved', 'Refunded'];

    const statusSpecificData = [];
    let totalStatusCount = 0;

    for (const status of statusData1) {
      const data = await Model.aggregate([
        {
          $match: { removed: false, status: status === 'Total' ? { $exists: true } : status, ...matchQuery },
        },
        {
          $group: {
            _id: status,
            count: { $sum: 1 },
            totalStudents: { $sum: '$students' },
            total_paid_amount: { $sum: '$total_paid_amount' },
            paid_amount: { $sum: '$paid_amount' },
          },
        },
        {
          $project: {
            _id: 1,
            count: 1,
            totalStudents: 1,
            total_paid_amount: 1,
            paid_amount: 1,
            due_amount: { $subtract: ['$total_course_fee', '$total_paid_amount'] },
          },
        },
      ]);

      statusSpecificData.push(data);
      totalStatusCount += data.length > 0 ? data[0].count : 0;
    }

    const summaryResult =
      result.length > 0
        ? { ...result[0]}
        : {
            count: 0,
            total_course_fee: 0,
            total_paid_amount: 0,
            paid_amount: 0,
            due_amount: 0,
          };

    return res.status(200).json({
      success: true,
      result: summaryResult,
      universitySpecificData,
      instituteSpecificData,
      statusSpecificData,
      message: `Successfully retrieved summary data.`,
    });
  } catch (error) {
    console.error('Error in summary:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = summary;
