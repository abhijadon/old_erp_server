const create = async (Model, req, res) => {
  try {
    const userId = req.user._id;
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

    // Save data to the local database
    const newDoc = new Model(newDocData);
    const result = await newDoc.save();


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
