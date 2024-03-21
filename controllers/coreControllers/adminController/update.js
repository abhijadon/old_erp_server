const UserHistory = require('@/models/UserHistory');
const mongoose = require('mongoose');
const Admin = mongoose.model('User');


const update = async (req, res) => {
  try {
    const existingDocument = await Admin.findById(req.params.id); // Find the existing document

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    }

    // Include updatedBy field in the request body
    req.body.updatedBy = req.user._id;

    // Store the old values before updating
    const oldValues = { ...existingDocument.toObject() };

    let updates = {
      role: req.body.role,
      username: req.body.username,
      fullname: req.body.fullname,
      phone: req.body.phone,
      photo: req.body.photo,
    };

    // Find document by id and updates with the required fields
    const result = await Admin.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
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
      await UserHistory.create({
        userId: req.params.id,
        updatedFields,
        updatedBy: req.user._id // Include the updatedBy field
      });
    }

    return res.status(200).json({
      success: true,
      result: {
        _id: result._id,
        enabled: result.enabled,
        username: result.username,
        fullname: result.fullname,
        phone: result.phone,
        photo: result.photo,
        role: result.role,
      },
      message: 'Document updated successfully with id: ' + req.params.id,
    });
  } catch (error) {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error,
    });
  }
};

module.exports = update;