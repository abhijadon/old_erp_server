const path = require('path');
const fs = require('fs');

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
      const imagePath = result.image; // Replace with your actual image path property name

      if (!imagePath || !fs.existsSync(imagePath)) {
        return res.status(404).json({
          success: false,
          result,
          message: 'Document found but image not found for this document',
        });
      }

      const image = fs.readFileSync(imagePath);
      const contentType = 'image/png'; // Change the content type according to your image type

      // Assuming you want to include the image data in the response
      const imageBase64 = Buffer.from(image).toString('base64');
      const imageDataURI = `data:${contentType};base64,${imageBase64}`;

      // Combine image data with result data
      const responseData = {
        ...result.toObject(),
        imageData: imageDataURI,
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
