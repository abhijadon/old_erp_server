const mongoose = require('mongoose');
const Model = mongoose.model('Payment');

const remove = async (req, res) => {
  try {
    // Find document by id and check if it has already been removed
    const previousPayment = await Model.findOne({
      _id: req.params.id,
      removed: false,
    });

    if (!previousPayment) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found with this id: ' + req.params.id,
      });
    }

    // Update the document by id and mark it as removed
    const updates = {
      removed: true,
    };

    // Find the document by id and update it
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();

    // If no results found, return document not found
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found with this id: ' + req.params.id,
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully marked the document as removed with id: ' + req.params.id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = remove;
