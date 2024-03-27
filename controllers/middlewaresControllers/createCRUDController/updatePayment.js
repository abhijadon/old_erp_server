const { Applications } = require('@/models/Application'); // Importing the Applications model
const ApplicationHistory = require('@/models/ApplicationHistory');

async function updatePayment(req, res) {
  try {
    const applicationId = req.params.id;
    const { paid_amount, installment_type, status } = req.body.customfields;

    const existingApplication = await Applications.findById(applicationId);

    if (!existingApplication) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
      
    // Store the old values before updating
    const oldValues = JSON.parse(JSON.stringify(existingApplication._doc));
    
    // Include updatedBy field in the request body
    req.body.updatedBy = req.user._id;

    if (paid_amount !== undefined) {
      existingApplication.previousPaidAmounts.push({ value: paid_amount, date: new Date() });
      existingApplication.customfields.total_paid_amount += parseInt(paid_amount);
      existingApplication.customfields.paid_amount = paid_amount; // Update paid_amount directly
    }

    if (installment_type !== undefined) {
      existingApplication.previousInstallmentType.push({ value: installment_type, date: new Date() });
      existingApplication.customfields.installment_type = installment_type;
    }

    if (status !== undefined) {
      existingApplication.previousstatus.push({ value: status, date: new Date() });
      existingApplication.customfields.status = status;
    }
     
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
        updatedBy: req.user._id // Include the updatedBy field
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
