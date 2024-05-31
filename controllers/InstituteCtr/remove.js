const Institute = require('@/models/Institute')
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the userId is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'ID is required.',
      });
    }

    // Delete permissions associated with the user
    const deletedInstitute = await Institute.findByIdAndDelete(id);

    if (!deletedInstitute) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Institute not found for the given userId.',
      });
    }

    return res.status(200).json({
      success: true,
      result: deletedInstitute,
      message: 'Institute deleted successfully for the given ID.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error,
    });
  }
};

module.exports = remove;
