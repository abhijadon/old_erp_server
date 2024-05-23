const { LMS } = require('@/models/Lms'); // Import the LMS model

const read = async (req, res) => {
    try {
        const { applicationId } = req.params; // Get the application ID from the route parameter

        // Find LMS document by applicationId
        const lmsDocument = await LMS.findOne({ applicationId });

        if (!lmsDocument) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found for the given application ID.',
            });
        }

        // Return success response with the found document
        return res.status(200).json({
            success: true,
            result: lmsDocument,
            message: 'LMS document found.',
        });
    } catch (error) {
        console.error('Error reading LMS document:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { read };
