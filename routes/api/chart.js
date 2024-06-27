// routes/payment.js
const express = require('express');
const router = express.Router();
const { Payment } = require('@/models/Payment');

router.get('/chart-data', async (req, res) => {
  try {
    const payments = await Payment.aggregate([
      {
        $group: {
          _id: { month: { $month: "$created" }, year: { $year: "$created" } },
          totalPaidAmount: { $sum: "$paid_amount" },
          totalCount: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const data = payments.map(payment => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return {
        name: `${monthNames[payment._id.month - 1]} ${payment._id.year}`,
        Amount: payment.totalPaidAmount,
        Count: payment.totalCount
      };
    });

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
