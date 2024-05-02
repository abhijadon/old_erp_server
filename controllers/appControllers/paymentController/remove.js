const mongoose = require('mongoose');
const Payment = mongoose.model('Payment');

const remove = async (req, res) => {
  try {
    const documentId = req.params.id;

    // Try to find and delete the document by ID
    const deletedDocument = await Payment.findByIdAndDelete(documentId);

    if (!deletedDocument) {
      return res.status(404).json({
        success: false,
        result: null,
        message: `No document found with this ID: ${documentId}`,
      });
    }

    return res.status(200).json({
      success: true,
      result: deletedDocument,
      message: `Successfully deleted the document with ID: ${documentId}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: `An error occurred while deleting the document: ${error.message}`,
      error: error,
    });
  }
};

module.exports = remove;
