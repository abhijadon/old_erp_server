const University = require('@/models/University');

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUniversity = req.body;
        const name = req.body.name;

    // Check if name is in uppercase
      if (name !== name.toUpperCase()) {
      return res.status(400).json({
        success: false,
        message: 'University name must be in uppercase',
        error: null,
      });
      }

        // Update permissions associated with the provided userId
        const result = await University.findByIdAndUpdate(id, updatedUniversity, { new: true });

        if (!result) {
            // If no permissions found for the provided userId, return an error
            return res.status(404).json({
                success: false,
                message: 'University not found',
                error: null,
            });
        }

        res.status(200).json({
            success: true,
            result: result,
            message: 'University updated successfully',
        });
    } catch (error) {
        console.error('Error updating University:', error);
        res.status(500).json({
            success: false,
            error: error,
        });
    }
};

module.exports = update;
