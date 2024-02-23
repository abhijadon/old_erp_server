const remove = async (Model, req, res) => {
  try {
    const documentId = req.params.id;

    // Find the document by id and delete it
    const result = await Model.deleteOne({ _id: documentId, removed: false }).exec();

    // If no results found, return document not found
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + documentId,
      });
    } else {
      return res.status(200).json({
        success: true,
        result: null,
        message: 'Successfully Deleted the document by id: ' + documentId,
      });
    }
  } catch (error) {
    console.error('Error removing document:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = remove;
