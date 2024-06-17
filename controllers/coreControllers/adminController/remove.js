const mongoose = require('mongoose');
const Admin = mongoose.model('User');

const remove = async (req, res) => {
  try {
    // Find the document by id and delete it
    const result = await Admin.findByIdAndDelete(req.params.id).exec();

    // If no results found, return document not found
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: 'Successfully Deleted the document by id: ' + req.params.id,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error,
    });
  }
};

module.exports = remove;
