const ApplicationHistory = require('@/models/ApplicationHistory');

async function update(Model, req, res) {
  try {
    const existingDocument = await Model.findById(req.params.id).exec();

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found",
      });
    }

    const oldValues = { ...existingDocument._doc };

    req.body.removed = false;
    req.body.updatedBy = req.user._id;

    const totalCourseFee = parseFloat(req.body.customfields.total_course_fee) || 0;
    const totalPaidAmount = parseFloat(req.body.customfields.total_paid_amount) || 0;
    const dueAmount = totalCourseFee - totalPaidAmount;
    req.body.customfields.due_amount = dueAmount.toString();

    const updatedDocument = await Model.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      req.body,
      { new: true, runValidators: true }
    ).exec();

    const updatedFields = {};

    // Compare all parameters within customfields, contact, and education for changes
    const fieldsToCheck = ['customfields', 'contact', 'education'];
    for (const field of fieldsToCheck) {
      for (const param of Object.keys(req.body[field])) {
        if (JSON.stringify(req.body[field][param]) !== JSON.stringify(oldValues[field][param])) {
          if (!updatedFields[field]) {
            updatedFields[field] = {};
          }
          updatedFields[field][param] = {
            oldValue: oldValues[field][param],
            newValue: req.body[field][param]
          };
        }
      }
    }

    // Check if full_name or lead_id has been updated
    if (req.body.full_name !== oldValues.full_name) {
      if (!updatedFields.customfields) {
        updatedFields.customfields = {};
      }
      updatedFields.customfields.full_name = {
        oldValue: oldValues.full_name,
        newValue: req.body.full_name
      };
    }
    if (req.body.lead_id !== oldValues.lead_id) {
      if (!updatedFields.customfields) {
        updatedFields.customfields = {};
      }
      updatedFields.customfields.lead_id = {
        oldValue: oldValues.lead_id,
        newValue: req.body.lead_id
      };
    }

    // Create application history if there are any updated fields
    if (Object.keys(updatedFields).length > 0) {
      await ApplicationHistory.create({
        applicationId: req.params.id,
        updatedFields,
        updatedBy: req.user._id
      });
    }

  

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
