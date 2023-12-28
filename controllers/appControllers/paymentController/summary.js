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
        },
      },
    ]);

    return result.length > 0 ? result[0].totalPaidAmount : 0;
  } catch (error) {
    console.error('Error fetching total payment amount:', error);
    throw error;
  }
};
const summary = async (req, res) => {
  try {
    let defaultType = 'month';
    const { type, institute_name, university_name, counselor_email } = req.query;

    if (type && ['week', 'month', 'year'].includes(type)) {
      defaultType = type;
    }

    const currentDate = moment();
    const startDate = currentDate.clone().startOf(defaultType);
    const endDate = currentDate.clone().endOf(defaultType);
    const matchQuery = {
      removed: false,
      date: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
    };
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

    const result = await Model.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
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
          due_amount: { $subtract: ['$total_paid_amount', '$paid_amount'] },
        },
      },
    ]);

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
          due_amount: { $subtract: ['$total_paid_amount', '$paid_amount'] },
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
          due_amount: { $subtract: ['$total_paid_amount', '$paid_amount'] },
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
    const universityData1 = ['Total_university_count', 'SPU', 'LPU', 'UPES', 'SGVU', 'CU', 'UU'];

    const universitySpecificData = [];
    for (const university of universityData1) {
      const data = await Model.aggregate([
        {
          $match: { removed: false, university_name: university },
        },
        {
          $group: {
            _id: '$university_name',
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
            due_amount: { $subtract: ['$total_paid_amount', '$paid_amount'] },
          },
        },
      ]);
      universitySpecificData.push(data);
    }

    // Fetch specific university data based on an array of university names
    const instituteData1 = ['Total_institute_count', 'HES', 'DES'];

    const instituteSpecificData = [];
    for (const institute of instituteData1) {
      const data = await Model.aggregate([
        {
          $match: { removed: false, institute_name: institute },
        },
        {
          $group: {
            _id: '$institute_name',
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
            due_amount: { $subtract: ['$total_paid_amount', '$paid_amount'] },
          },
        },
      ]);
      instituteSpecificData.push(data);
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
      instituteData: formattedInstituteData,
      universityData: formattedUniversityData,
      universitySpecificData,
      instituteSpecificData,
      universityCounts,
      instituteCounts, // Include the counts of each university
      message: `Successfully fetched the summary of payment invoices for the last ${defaultType}`,
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
