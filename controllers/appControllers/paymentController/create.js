const mongoose = require('mongoose');
const Model = mongoose.model('Payment');
const create = async (req, res) => {
  try {
    const result = await Model.create(req.body);
    res.status(200).json({
      success: true,
      result: "Done",
      message: 'Payment Invoice created successfully',
    });
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    if (error.name == 'ValidationError') {
      res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: error,
      });
    } else {
      // Server Error
      res.status(500).json({
        success: false,
        result: null,
        message: error.message,
        error: error,
      });
    }
  }
};

module.exports = create;
