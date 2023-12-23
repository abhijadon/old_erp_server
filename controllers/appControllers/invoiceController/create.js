const mongoose = require('mongoose');
const Model = mongoose.model('Invoice');

const create = async (req, res) => {
  try {
    const body = req.body;

    // Assuming the body follows the structure specified in your schema

    const result = await new Model(body).save();

    // const updateResult = await Model.findOneAndUpdate(
    //   { _id: result._id },
    //   { pdfPath: fileId },
    //   { new: true }
    // ).exec();

    // Assuming the rest of your logic here, such as increasing settings, generating PDF, etc.

    return res.status(200).json({
      success: true,
      result: 'Done',
      message: 'Invoice created successfully',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      result: null,
      error: error,
      message: error.message,
    });
  }
};

module.exports = create;
