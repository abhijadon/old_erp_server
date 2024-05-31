const Subcourse = require('@/models/Subcourse');

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSubcourse = req.body;


        // Update subcourse associated with the provided ID
        const result = await Subcourse.findByIdAndUpdate(id, updatedSubcourse, { new: true });

        if (!result) {
            // If no subcourse found for the provided ID, return an error
            return res.status(404).json({
                success: false,
                message: 'Subcourse not found',
                error: null,
            });
        }

        res.status(200).json({
            success: true,
            result: result,
            message: 'Subcourse updated successfully',
        });
    } catch (error) {
        console.error('Error updating Subcourse:', error);
        res.status(500).json({
            success: false,
            error: error,
        });
    }
};

module.exports = update;
