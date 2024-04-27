const { Applications } = require('@/models/Application');

async function uploadDocument(req, res) {
  try {
    // Retrieve application ID from request parameters
    const applicationId = req.params.id;

    // Retrieve documents from the request (assuming middleware has already processed the file uploads)
    const { feeDocument, studentDocument } = req.imageUrls; // Adjust if needed based on middleware's output

    // Fetch the existing application by ID
    const existingApplication = await Applications.findById(applicationId);

    if (!existingApplication) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check if feeDocument and studentDocument are provided and are arrays
    if (feeDocument && Array.isArray(feeDocument)) {
      feeDocument.forEach((file) => {
        existingApplication.feeDocument.push(file); // Add to existing documents
      });
    }

    if (studentDocument && Array.isArray(studentDocument)) {
      studentDocument.forEach((file) => {
        existingApplication.studentDocument.push(file); // Add to existing documents
      });
    }

    // Save the application after updating only the document fields
    await existingApplication.save();

    return res.status(200).json({
      success: true,
      message: 'Documents successfully uploaded and added to the application.',
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
}

module.exports = {
  uploadDocument,
};
