const { Applications } = require('@/models/Application'); // Importing the Applications model
const ApplicationHistory = require('@/models/ApplicationHistory');


async function updatePayment(req, res) {
  try {
    const applicationId = req.params.id;
    const { paid_amount, installment_type, paymentStatus, payment_mode, payment_type } = req.body.customfields;

    const existingApplication = await Applications.findById(applicationId);

    if (!existingApplication) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
      
    // Store the old values before updating
    const oldValues = JSON.parse(JSON.stringify(existingApplication._doc));
    req.body.removed = false;
    // Include updatedBy field in the request body
    const updatedBy = req.user._id;

    // Define an object to hold all updated fields
    const updatedCustomFields = {};

    // Check if paymentStatus is 'approved' or 'rejected' before updating total_paid_amount
  if (paymentStatus.toLowerCase() === 'payment received') {
      if (paid_amount !== undefined) {
        existingApplication.customfields.total_paid_amount += parseInt(paid_amount);
        existingApplication.customfields.paid_amount = paid_amount; // Update paid_amount directly
        updatedCustomFields.paid_amount = paid_amount;
      }
    }

    if (installment_type !== undefined) {
      existingApplication.customfields.installment_type = installment_type;
      updatedCustomFields.installment_type = installment_type;
    }

    if (paymentStatus !== undefined) {
      existingApplication.customfields.paymentStatus = paymentStatus;
      updatedCustomFields.paymentStatus = paymentStatus;
    }

    if (payment_mode !== undefined) {
      existingApplication.customfields.payment_mode = payment_mode;
      updatedCustomFields.payment_mode = payment_mode;
    }
     
    if (payment_type !== undefined) {
      existingApplication.customfields.payment_type = payment_type;
      updatedCustomFields.payment_type = payment_type;
    }

    // Calculate due amount
    const totalCourseFee = parseFloat(existingApplication.customfields.total_course_fee);
    const totalPaidAmount = parseFloat(existingApplication.customfields.total_paid_amount);
    const dueAmount = totalCourseFee - totalPaidAmount;

    // Update due amount in customfields
    existingApplication.customfields.due_amount = dueAmount;

    // Push all previous data together as a single object into previousData array
    existingApplication.previousData.push({
      installment_type: installment_type,
      paymentStatus: paymentStatus,
      payment_mode: payment_mode,
      payment_type: payment_type,
      total_paid_amount: totalPaidAmount, // Save the total paid amount
      total_course_fee: totalCourseFee,
      paid_amount: paid_amount, // Save the total course fee
      due_amount: dueAmount, // Save the due amount
      date: new Date() // Ensure that date is in the correct format
    });

     const updatedFields = {};

    const fieldsToCheck = ['customfields', 'contact', 'education'];
for (const field of fieldsToCheck) {
  if (req.body[field] && typeof req.body[field] === 'object') {
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


    // Save the changes to the application
    await existingApplication.save();


    return res.status(200).json({ success: true, message: "Application updated successfully" });
  } catch (error) {
    console.error("Error updating application:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = {
  updatePayment
};


