const mongoose = require('mongoose');
const moment = require('moment');

const Model = mongoose.model('Payment');

const getTotalPaymentAmount = async () => {
  try {
    const result = await Model.aggregate([
      {
        $group: {
          _id: null,
          totalPaidAmount: { $sum: '$total_paid_amount' },
          totalCourseFee: { $sum: '$total_course_fee' }, // Added line for total_course_fee
        },
      },
    ]);

    return result.length > 0
      ? {
          totalPaidAmount: result[0].totalPaidAmount,
          totalCourseFee: result[0].totalCourseFee,
        }
      : {
          totalPaidAmount: 0,
          totalCourseFee: 0,
        };
  } catch (error) {
    console.error('Error fetching total payment amount:', error);
    throw error;
  }
};

const summary = async (req, res) => {
  try {
    const {
      payment_type,
      payment_mode,
      institute_name,
      university_name,
      counselor_email,
      status,
      year,
      month,
      week,
      date,
      time,
    } = req.query;

    const matchQuery = {
      removed: false,
    };

    if (date) {
      const currentDate = new Date(date);
      const nextDate = moment(currentDate).add(1, 'days').toDate();

      matchQuery.date = {
        $gte: currentDate,
        $lt: nextDate,
      };
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

    if (time) {
      const [hours, minutes] = moment(time, 'hh:mm A').format('HH:mm').split(':').map(Number);

      const timeRangeStart = moment().set({ hours, minutes, seconds: 0, milliseconds: 0 }).toDate();
      const timeRangeEnd = moment()
        .set({ hours, minutes, seconds: 59, milliseconds: 999 })
        .toDate();

      matchQuery.time = {
        $gte: timeRangeStart,
        $lte: timeRangeEnd,
      };
    }

    if (institute_name) {
      matchQuery.institute_name = institute_name;
    }

    if (university_name) {
      matchQuery.university_name = university_name;
    }
    if (counselor_email) {
      // Adjust the filter to consider the nested structure
      matchQuery.counselor_email = {
        $exists: true,
        $eq: counselor_email.toLowerCase(),
      };
    }
    if (payment_type) {
      matchQuery.payment_type = payment_type;
    }
      if (payment_mode) {
      matchQuery.payment_mode = payment_mode;
    }
    if (status) {
      matchQuery.status = status; // Include dynamic status filtering
    }

    const result = await Model.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          total_paid_amount: { $sum: '$total_paid_amount' },
          paid_amount: { $sum: '$paid_amount' },
          total_course_fee: { $sum: '$total_course_fee' },
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
    // Check if any data is found based on the filters
    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        result: null,
        message: `No data found based on the specified filters.`,
      });
    }
    const instituteData = await Model.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$institute_name',
          count: { $sum: 1 }, // Add count attribute to get the number of records per institute
          totalStudents: { $sum: '$students' },
          total_paid_amount: { $sum: '$total_paid_amount' },
          paid_amount: { $sum: '$paid_amount' },
        },
      },
      {
        $project: {
          _id: 1,
          count: 1, // Include count in the projected output
          totalStudents: 1,
          total_paid_amount: 1,
          paid_amount: 1,
          due_amount: { $subtract: ['$total_course_fee', '$total_paid_amount'] },
        },
      },
    ]);
    const statusData = await Model.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }, // Add count attribute to get the number of records per institute
          totalStudents: { $sum: '$students' },
          total_paid_amount: { $sum: '$total_paid_amount' },
          paid_amount: { $sum: '$paid_amount' },
        },
      },
      {
        $project: {
          _id: 1,
          count: 1, // Include count in the projected output
          totalStudents: 1,
          total_paid_amount: 1,
          paid_amount: 1,
          due_amount: { $subtract: ['$total_course_fee', '$total_paid_amount'] },
        },
      },
    ]);
    const universityData = await Model.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$university_name',
          count: { $sum: 1 }, // Add count attribute to get the number of records per university
          totalStudents: { $sum: '$students' },
          total_paid_amount: { $sum: '$total_paid_amount' },
          paid_amount: { $sum: '$paid_amount' },
        },
      },
      {
        $project: {
          _id: 1,
          count: 1, // Include count in the projected output
          totalStudents: 1,
          total_paid_amount: 1,
          paid_amount: 1,
          due_amount: { $subtract: ['$total_course_fee', '$total_paid_amount'] },
        },
      },
    ]);

    const universityTotalCountData = await Model.aggregate([
      { $group: { _id: '$university_name', count: { $sum: 1 } } }, // Group by university name and count records
      {
        $group: {
          _id: null,
          totalUniversityCount: { $sum: '$count' }, // Sum all counts to get total university count
        },
      },
    ]);

    const totalUniversityCount =
      universityTotalCountData.length > 0 ? universityTotalCountData[0].totalUniversityCount : 0;
    // institute count
    const instituteTotalCountData = await Model.aggregate([
      { $group: { _id: '$institute_name', count: { $sum: 1 } } }, // Group by university name and count records
      {
        $group: {
          _id: null,
          totalInstituteCount: { $sum: '$count' }, // Sum all counts to get total university count
        },
      },
    ]);
    const totalInstituteCount =
      instituteTotalCountData.length > 0 ? instituteTotalCountData[0].totalInstituteCount : 0;
    // Fetch specific university data based on an array of university names
    const universityData1 = [
      'University', // Corrected from 'Univeristy' to 'University'
      'SPU',
      'LPU',
      'UPES',
      'SGVU',
      'CU',
      'UU',
      'JAIN',
      'DPU',
      'SVSU',      
      'VIGNAN',
      'MANIPAL',
      'SMU',
      'HU',
      'BOSSE',
      'MANGALAYATAN',
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

    // Fetch specific university data based on an array of university names
    const instituteData1 = ['Institute', 'HES', 'DES'];
    const instituteSpecificData = [];
    let countInstitute = 0;
    for (const institute of instituteData1) {
      const data = await Model.aggregate([
        {
          $match: {
            removed: false,
            institute_name: institute === 'Institute' ? { $exists: true } : institute,
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

    // Fetch specific status data based on an array of status names
    const statusData1 = ['Total', 'New', 'Cancel', 'Alumini', 'Enrolled'];

    const statusSpecificData = [];
    let totalStatusCount = 0; // Initialize a variable to store the total count

    for (const status of statusData1) {
      const data = await Model.aggregate([
        {
          $match: { removed: false, status: status === 'Total' ? { $exists: true } : status },
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

      // Increment the total count
      totalStatusCount += data.length > 0 ? data[0].count : 0;
    }

    const totalPaymentAmount = await getTotalPaymentAmount();

    const formattedInstituteData = instituteData.map((data) => ({
      tag: data._id || 'Unknown Institute',
      value: data.total,
      totalPaidAmount: data.total_paid_amount,
      paidAmount: data.paid_amount,
      DueAmount: data.due_amount,
      // Add color property here if needed
    }));
    const formattedUniversityData = universityData.map((data) => ({
      university: data._id || 'Unknown University',
      totalCount: data.count,
    }));

    const summaryResult =
      result.length > 0
        ? { ...result[0], totalPaymentAmount }
        : {
            count: 0,
            total_paid_amount: 0,
            paid_amount: 0,
            due_amount: 0,
            totalPaymentAmount,
          };

    const universityCounts = {}; // Object to store university counts
    universityData.forEach((data) => {
      universityCounts[data._id || 'Unknown University'] = data.count;
    });

    const instituteCounts = {}; // Object to store institute counts
    instituteData.forEach((data) => {
      instituteCounts[data._id || 'Unknown Institute'] = data.count; // Corrected assignment
    });
    const formattedStatusData = statusData.map((data) => ({
      tag: data._id || 'Unknown Status',
      value: data.total,
      totalPaidAmount: data.total_paid_amount,
      paidAmount: data.paid_amount,
      DueAmount: data.due_amount,
      // Add color property here if needed
    }));

    if (universityData.length === 0 && university_name) {
      return res.status(200).json({
        success: true,
        result: null,
        instituteData: formattedInstituteData,
        universityData: formattedUniversityData,
        message: `The specified university (${university_name}) does not exist in the dataset.`,
      });
    }

    return res.status(200).json({
      success: true,
      totalUniversityCount,
      totalInstituteCount,
      result: summaryResult,
      statusData,
      instituteData: formattedInstituteData,
      universityData: formattedUniversityData,
      universitySpecificData,
      instituteSpecificData,
      statusSpecificData,
      universityCounts,
      instituteCounts,
      formattedStatusData,
      totalPaymentAmount,
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
