// update.js

const ApplicationHistory = require('@/models/ApplicationHistory'); // Assuming correct path to ApplicationHistory model
const { Payment } = require('@/models/Payment'); // Assuming correct path to Payment model

async function update(Model, req, res) {
  try {
    // Find the document by id
    const existingDocument = await Model.findById(req.params.id).exec();

    // Check if the document exists
    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found",
      });
    }

    // Store the old values before updating
    const oldValues = {};
    for (const key of Object.keys(existingDocument._doc)) {
      oldValues[key] = existingDocument[key];
    }

    // Update the document
    req.body.removed = false;
    // Include updatedBy field in the request body
    req.body.updatedBy = req.user._id;
    const updatedDocument = await Model.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      req.body,
      { new: true, runValidators: true }
    ).exec();

    // Define updatedFields variable
    const updatedFields = {}; // Initialize empty object

    // Populate updatedFields with updated fields and old values
    for (const key of Object.keys(req.body)) {
      if (JSON.stringify(req.body[key]) !== JSON.stringify(oldValues[key])) {
        // Only include fields that have been updated
        updatedFields[key] = {
          oldValue: oldValues[key],
          newValue: req.body[key]
        };
      }
    }

    // Create application history if there are any updated fields
    if (Object.keys(updatedFields).length > 0) {
      await ApplicationHistory.create({
        applicationId: req.params.id,
        updatedFields,
        updatedBy: req.user._id // Include the updatedBy field
      });
    }

    // Update the payment model with the same updatedBy value
    await Payment.findOneAndUpdate(
      { applicationId: req.params.id },
      { $set: { updatedBy: req.user._id } }
    );

    // Return success response
    return res.status(200).json({
      success: true,
      result: updatedDocument,
      message: "Document updated successfully",
    }); 

  } catch (error) {
    console.error("Error updating document:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = update;
