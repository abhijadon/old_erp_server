// Code adjustment: Validate mode_info before saving
const { courseInfo } = require('@/models/courseInfo');

const create = async (req, res) => {
    try {
        // Check if the 'mode_info' field is provided and not empty
        if (!req.body.mode_info) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Mode field is required',
            });
        }

        // Create a new Info document
        const newInfo = new courseInfo(req.body);
        const result = await newInfo.save();

        // Respond with the created document
        res.status(200).json({
            success: true,
            result: result,
            message: 'Info created successfully',
        });
    } catch (error) {
        console.error('Error saving to the database:', error);
        if (error.code === 11000 && error.keyValue && error.keyValue.Mode === null) {
            // Handle specific case of duplicate key with null value for 'Mode'
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Mode value must be unique and cannot be null',
                error: error,
            });
        }

        // Handle other types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Required fields are not supplied',
                error: error,
            });
        } else {
            return res.status(500).json({
                success: false,
                result: null,
                message: 'An error occurred while saving the data',
                error: error,
            });
        }
    }
};


module.exports = create;
