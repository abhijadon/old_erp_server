const { Applications } = require('@/models/Application');

const deleteImage = async (req, res) => {
  const { imageUrl, lead_id, documentType } = req.body;

  try {
    // Fetch the application by lead_id
    const application = await Applications.findOne({ lead_id });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Find the document in the specified document type array
    const documentArray = application[documentType];
    if (!documentArray) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    // Locate the document by its download URL
    const documentIndex = documentArray.findIndex(doc => doc.downloadURL === imageUrl);
    if (documentIndex === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Remove the document from the MongoDB document array
    documentArray.splice(documentIndex, 1);
    await application.save();

    res.status(200).json({ message: 'Image record deleted successfully from MongoDB.' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { deleteImage };
