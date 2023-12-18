const read = async (Model, req, res) => {
  try {
    // Find document by id
    const result = await Model.findOne({ _id: req.params.id, removed: false });

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    } else {
      // Assuming the image is stored in the 'img' field
      const imageData = result.img; // Retrieve image data

      if (!imageData) {
        return res.status(404).json({
          success: false,
          result,
          message: 'Document found but image not found for this document',
        });
      }

      // Include the image data along with other document data
      const responseData = {
        ...result.toObject(),
        img: imageData, // Include image data in the response
      };

      return res.status(200).json({
        success: true,
        result: responseData,
        message: 'Document and image found by this id: ' + req.params.id,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = read;
