const ApplicationHistory = require('@/models/ApplicationHistory');
const { sendDataToExternalAPI } = require('@/helpers/sendLms');
const User = require('@/models/User');
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

    // Fetch the user details using userId
    const user = await User.findById(existingDocument.userId).exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "User not found",
      });
    }


    // Start with a copy of the existing document
    const updatedDocumentData = { ...existingDocument._doc };
    // Merge customfields with existing data to retain existing values
    if (req.body.customfields) {
      const customfields = { ...existingDocument.customfields };

      // Update customfields only with new data, retain old data otherwise
      if (req.body.customfields.lmsStatus !== undefined) {
        customfields.lmsStatus = req.body.customfields.lmsStatus;
      }

      if (req.body.customfields.enrollment !== undefined) {
        customfields.enrollment = req.body.customfields.enrollment;
      }

      updatedDocumentData.customfields = { ...customfields, ...req.body.customfields };
    }

    // If a new `full_name` is provided, update it
    if (req.body.full_name !== undefined) {
      updatedDocumentData.full_name = req.body.full_name;
    }

    // Merge other sections like contact and education
    if (req.body.contact) {
      updatedDocumentData.contact = {
        ...existingDocument.contact,
        ...req.body.contact,
      };
    }

    if (req.body.education) {
      updatedDocumentData.education = {
        ...existingDocument.education,
        ...req.body.education,
      };
    }

    // Ensure total_course_fee and related calculations are updated correctly
    const totalCourseFee = parseFloat(updatedDocumentData.customfields.total_course_fee) || 0;
    const totalPaidAmount = parseFloat(updatedDocumentData.customfields.total_paid_amount) || 0;
    const dueAmount = totalCourseFee - totalPaidAmount;
    updatedDocumentData.customfields.due_amount = dueAmount.toString();

    // Update the document in the database
    const updatedDocument = await Model.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      updatedDocumentData,// Ensure the updated data includes full_name
      { new: true, runValidators: true }
    ).exec();

    // Track updated fields for history
    const updatedFields = {};

    const fieldsToCheck = ['customfields', 'contact', 'education'];
    fieldsToCheck.forEach((field) => {
      Object.keys(updatedDocumentData[field] || {}).forEach((param) => {
        if (
          JSON.stringify(updatedDocumentData[field][param]) !==
          JSON.stringify(existingDocument._doc[field]?.[param])
        ) {
          if (!updatedFields[field]) {
            updatedFields[field] = {};
          }
          updatedFields[field][param] = {
            oldValue: existingDocument._doc[field]?.[param],
            newValue: updatedDocumentData[field][param],
          };
        }
      });
    });

    // Additional checks for `full_name` and `lead_id`
    if (req.body.full_name !== existingDocument.full_name) {
      if (!updatedFields.customfields) {
        updatedFields.customfields = {};
      }
      updatedFields.customfields.full_name = {
        oldValue: existingDocument.full_name,
        newValue: req.body.full_name,
      };
    }

    if (req.body.lead_id && req.body.lead_id !== existingDocument.lead_id) {
      if (!updatedFields.customfields) {
        updatedFields.customfields = {};
      }
      updatedFields.customfields.lead_id = {
        oldValue: existingDocument.lead_id,
        newValue: req.body.lead_id,
      };
    }

    // Create an application history record if there were updates
    if (Object.keys(updatedFields).length > 0) {
      await ApplicationHistory.create({
        applicationId: req.params.id,
        updatedFields,
        updatedBy: req.user._id,
      });
    }

  //  Check if status is "Approved" and LMS is "yes" before sending data to external API
   if (
      updatedDocumentData.customfields.lmsStatus === "yes" &&
      updatedDocumentData.customfields.status === "Approved"
    ) {
      console.log('updatedDocumentData before sending to external API:', updatedDocumentData); // Debug: Log the data before sending

      // Include the user's username in the data to be sent to the external API
      updatedDocumentData.userId = {
        ...updatedDocumentData.userId,
        username: user.username
      };

      // Send data to external API
      await sendDataToExternalAPI(updatedDocumentData);
    }

    return res.status(200).json({
      success: true,
      result: updatedDocument,
      message: "Document updated successfully",
    });

  } catch (error) {
    console.error("Error updating document:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = update;
