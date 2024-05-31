const Institute = require('@/models/Institute');

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInstitute = req.body;
        const name = req.body.name;

    // Check if name is in uppercase
      if (name !== name.toUpperCase()) {
      return res.status(400).json({
        success: false,
        message: 'Institute name must be in uppercase',
        error: null,
      });
      }

        // Update permissions associated with the provided userId
        const result = await Institute.findByIdAndUpdate(id, updatedInstitute, { new: true });

        if (!result) {
            // If no permissions found for the provided userId, return an error
            return res.status(404).json({
                success: false,
                message: 'Institute not found',
                error: null,
            });
        }

        res.status(200).json({
            success: true,
            result: result,
            message: 'Institute updated successfully',
        });
    } catch (error) {
        console.error('Error updating Institute:', error);
        res.status(500).json({
            success: false,
            error: error,
        });
    }
};

module.exports = update;
