const { sendDataToExternalAPI } = require('@/helpers/sendLms'); // Import the helper function
const { HistoryModel } = require("@/models/Addonhistory")
const create = async (Model, req, res) => {
  console.log('req.body:', req.body)
  try {
    const userId = req.user._id;
    const userFullname = req.user.fullname;


    const {
      'customfields.payment_type': payment_type,
      'customfields.payment_mode': payment_mode,
      'customfields.total_course_fee': totalCourseFee,
      'customfields.total_paid_amount': totalPaidAmount,
      'customfields.paid_amount': paidAmount,
    } = req.body;

    const { feeDocument, studentDocument } = req.imageUrls;

    const parsedTotalPaidAmount = parseFloat(totalPaidAmount) || 0;
    const parsedPaidAmount = parseFloat(paidAmount) || 0;

    const updatedTotalPaidAmount = parsedTotalPaidAmount + parsedPaidAmount;

    const dueAmount = parseFloat(totalCourseFee) - updatedTotalPaidAmount;

    const newDocData = {
      userId,
      userFullname,
      ...req.body,
      'customfields.due_amount': dueAmount.toString(),
      'customfields.total_paid_amount': updatedTotalPaidAmount.toString(),
      'customfields.installment_type': '1st Installment',
      'customfields.status': 'New',
      'customfields.paymentStatus': 'payment received',
      feeDocument,
      studentDocument,
    };

    const initialPreviousData = {
      installment_type: '1st Installment',
      paymentStatus: 'payment received',
      payment_type,
      payment_mode,
      total_course_fee: totalCourseFee,
      total_paid_amount: updatedTotalPaidAmount,
      paid_amount: parsedPaidAmount,
      due_amount: dueAmount.toString(),
      date: new Date(),
    };

    newDocData.previousData = [initialPreviousData];

    // // Send data to external API
    await sendDataToExternalAPI(newDocData);

    // Save data to the local database
    const newDoc = new Model(newDocData);
    const result = await newDoc.save();

    // Create a history record
    const historyData = {
      dataId: result._id, // Referencing the original data
      userId, // Who made the change
      changes: newDocData, // What changes were made
      timestamp: new Date(), // When the change happened
    };

    const historyRecord = new HistoryModel(historyData);
    await historyRecord.save(); // Save the history record


    return res.status(200).json({
      success: true,
      result,
      message: `Data successfully added.`,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error,
      });
    } else {
      return res.status(500).json({
        success: false,
        result: null,
        message: error.message,
        error,
      });
    }
  }
};

module.exports = { create };
