const Subcourse = require('@/models/Subcourse');


const create = async (req, res) => {
    try {
        // Check if permissions for the provided name already exist
        const existingSubcourse = await Subcourse.findOne({ Subcourse: req.body.subcourse  });

        if (existingSubcourse) {
            // Subcourse for the provided name already exists
            return res.status(400).json({
                success: false,
                message: 'Subcourse for the provided name already exists',
                error: null,
            });
        }

        // Create new Subcourse if no existing Subcourse found for the provided name
        const newSubcourse = new Subcourse( req.body );
        const result = await newSubcourse.save();

        res.status(200).json({
            success: true,
            result: result,
            message: 'New Subcourse created successfully',
        });
    } catch (error) {
        console.error('Error saving to the database:', error);

        if (error.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                result: null,
                message: 'Required fields are not supplied',
                error: error,
            });
        } else {
            res.status(500).json({
                success: false,
                result: null,
                message: error.message,
                error: error,
            });
        }
    }
};

module.exports = create;
