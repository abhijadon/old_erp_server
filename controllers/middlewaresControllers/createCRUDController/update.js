const update = async (Model, req, res) => {
  try {
    const { id } = req.params;

    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate(
      { _id: id, removed: false },
      req.body,
      { new: true, runValidators: true }
    ).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: `No document found by this id: ${id}`,
      });
    }

//  // Update total_paid_amount based on paid_amount
// if (req.body.customfields && req.body.customfields.paid_amount) {
//   result.customfields.total_paid_amount =
//     result.customfields.total_paid_amount || 0; // Ensure it's initialized
//   result.customfields.total_paid_amount += parseFloat(req.body.customfields.paid_amount);
// }

    // Save the changes
    await result.save();

    return res.status(200).json({
      success: true,
      result,
      message: `Document updated successfully by this id: ${id}`,
    });
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: error,
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: error.message,
        error: error,
      });
    }
  }
};

module.exports = update;
