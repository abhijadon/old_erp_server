const mongoose = require('mongoose');
const Model = mongoose.model('Payment');

const update = async (req, res) => {
  try {
    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
      new: true, // return the new result instead of the old one
      runValidators: true,
    }).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    } else {
      // Check if the paid_amount field is present in the request body
      if (req.body.paid_amount !== undefined) {
        // Convert req.body.paid_amount to a number
        const paidAmount = parseFloat(req.body.paid_amount);

        // Update total_paid_amount based on the current paid amount
        result.total_paid_amount += paidAmount;

        // Save the updated document
        await result.save();
      }

      return res.status(200).json({
        success: true,
        result,
        message: 'We update this document by this id: ' + req.params.id,
      });
    }
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    if (error.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: error,
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: error.message,
        error: error,
      });
    }
  }
};

module.exports = update;
