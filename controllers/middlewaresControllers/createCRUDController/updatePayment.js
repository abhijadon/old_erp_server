const { Applications } = require('@/models/Application'); // Importing the Applications model
const ApplicationHistory = require('@/models/ApplicationHistory');
const { Payment } = require('@/models/Payment'); // Importing the Payment model

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
    
    // Include updatedBy field in the request body
    const updatedBy = req.user._id;

    // Define an object to hold all updated fields
    const updatedCustomFields = {};

    if (paid_amount !== undefined) {
      existingApplication.customfields.total_paid_amount += parseInt(paid_amount);
      existingApplication.customfields.paid_amount = paid_amount; // Update paid_amount directly
      updatedCustomFields.paid_amount = paid_amount;
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

    // Define updatedFields variable
    const updatedFields = {}; 

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
        updatedBy // Include the updatedBy field
      });
    }

    // Save the changes to the application
    await existingApplication.save();

    // Update the payment model with the same updatedBy value
    await Payment.findOneAndUpdate(
      { applicationId },
      { $set: { updatedBy } }
    );

    return res.status(200).json({ success: true, message: "Application updated successfully" });
  } catch (error) {
    console.error("Error updating application:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = {
  updatePayment
};

