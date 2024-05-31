const PermissionAllowed = require('@/models/PermissionAllowed');

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPermissionAllowed = req.body;
        const name = req.body.name;

    // Check if name is in uppercase
      if (name !== name.toUpperCase()) {
      return res.status(400).json({
        success: false,
        message: 'PermissionAllowed name must be in uppercase',
        error: null,
      });
      }

        // Update permissions associated with the provided userId
        const result = await PermissionAllowed.findByIdAndUpdate(id, updatedPermissionAllowed, { new: true });

        if (!result) {
            // If no permissions found for the provided userId, return an error
            return res.status(404).json({
                success: false,
                message: 'PermissionAllowed not found',
                error: null,
            });
        }

        res.status(200).json({
            success: true,
            result: result,
            message: 'PermissionAllowed updated successfully',
        });
    } catch (error) {
        console.error('Error updating PermissionAllowed:', error);
        res.status(500).json({
            success: false,
            error: error,
        });
    }
};

module.exports = update;
