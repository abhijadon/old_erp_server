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

    if (result && result.length > 0) {
      return result[0].totalPaidAmount;
    }

    return 0;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const summary = async (req, res) => {
  try {
    let defaultType = 'month';
    const { type } = req.query;

    if (type && ['week', 'month', 'year'].includes(type)) {
      defaultType = type;
    }

    const currentDate = moment();
    const startDate = currentDate.clone().startOf(defaultType);
    const endDate = currentDate.clone().endOf(defaultType);

    const result = await Model.aggregate([
      {
        $match: {
          removed: false,
          date: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        },
      },
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

    const totalPaymentAmount = await getTotalPaymentAmount(); // Fetch total payment amount

    const summaryResult =
      result.length > 0
        ? { ...result[0], totalPaymentAmount }
        : { count: 0, total_paid_amount: 0, paid_amount: 0, due_amount: 0, totalPaymentAmount };

    return res.status(200).json({
      success: true,
      result: summaryResult,
      message: `Successfully fetched the summary of payment invoices for the last ${defaultType}`,
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = summary;
