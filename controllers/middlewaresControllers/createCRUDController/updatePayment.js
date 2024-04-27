const { Applications } = require('@/models/Application');
const ApplicationHistory = require('@/models/ApplicationHistory');
const DesMail = require('@/emailTemplate/paymentEmail/DesMail');
const HesMail = require('@/emailTemplate/paymentEmail/HesMail');

async function updatePayment(req, res) {
  try {
    // Retrieve application ID and request data
    const applicationId = req.params.id;
    const customfields = req.body.customfields;
    const contact = req.body.contact;
    const { feeDocument } = req.imageUrls;

    // Validate customfields
    if (!customfields || typeof customfields !== 'object') {
      return res.status(400).json({ success: false, message: "Invalid customfields data" });
    }

    const { email } = contact;
    const { paid_amount, installment_type, paymentStatus, payment_mode, payment_type, institute_name, university_name, sendfeeReciept } = customfields;

    const status = paymentStatus ? paymentStatus.toLowerCase() : '';

    // Fetch the existing application from the database
    const existingApplication = await Applications.findById(applicationId);

    if (!existingApplication) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Ensure we don't update if the status is already 'payment approved'
    const currentPaymentStatus = existingApplication.customfields.paymentStatus;

    if (currentPaymentStatus === 'payment approved' && status === 'payment approved') {
      return res.status(400).json({
        success: false,
        message: "Cannot update application because the payment status is 'payment approved'. Change the status to update other fields.",
      });
    } 

    if (currentPaymentStatus === 'payment rejected' && status === 'payment rejected') {
      return res.status(400).json({
        success: false,
        message: "Cannot update application because the payment status is 'payment rejected'. Change the status to update other fields.",
      });
    }
    // Continue with other updates if status is valid
    const updatedCustomFields = {};

      // Handle updates to paid amount
    if (status === 'payment received') {
      if (currentPaymentStatus !== 'payment approved') {
        return res.status(400).json({ success: false, message: "Cannot mark as 'payment received' unless the previous status was 'payment approved'." });
      }
      
      if (paid_amount !== undefined) {
        // Convert paid_amount to a number
        const amountToAdd = parseFloat(paid_amount);

        // Check for valid total_paid_amount and paid_amount
        let totalPaidAmount = parseFloat(existingApplication.customfields.total_paid_amount);

        if (isNaN(totalPaidAmount) || isNaN(amountToAdd)) {
          return res.status(400).json({ success: false, message: "Invalid numerical data" });
        }

        // Increment the total paid amount
        totalPaidAmount += amountToAdd;

        existingApplication.customfields.total_paid_amount = totalPaidAmount;
        existingApplication.customfields.paid_amount = amountToAdd;

        updatedCustomFields.paid_amount = amountToAdd;
      }
    }
    // Update other custom fields
    if (installment_type !== undefined) {
      existingApplication.customfields.installment_type = installment_type;
      updatedCustomFields.installment_type = installment_type;
    }

    if (status !== undefined) {
      existingApplication.customfields.paymentStatus = status;
      updatedCustomFields.paymentStatus = status;
    }

    if (payment_mode !== undefined) {
      existingApplication.customfields.payment_mode = payment_mode;
      updatedCustomFields.payment_mode = payment_mode;
    }

    if (payment_type !== undefined) {
      existingApplication.customfields.payment_type = payment_type;
      updatedCustomFields.payment_type = payment_type;
    }

    // Calculate the due amount
    const totalCourseFee = parseFloat(existingApplication.customfields.total_course_fee);
    const totalPaidAmount = parseFloat(existingApplication.customfields.total_paid_amount);
    const dueAmount = totalCourseFee - totalPaidAmount;

    existingApplication.customfields.due_amount = dueAmount;

    // Log the changes in application history
    existingApplication.previousData.push({
      installment_type,
      paymentStatus: status,
      sendfeeReciept,
      payment_mode,
      payment_type,
      total_course_fee: totalCourseFee,
      total_paid_amount: totalPaidAmount,
      paid_amount,
      due_amount: dueAmount,
      date: new Date(),
    });

    // Create an application history record for updated fields
    const updatedFields = {};

    const fieldsToCheck = ['customfields', 'contact', 'education'];
    for (const field of fieldsToCheck) {
      if (req.body[field] && typeof req.body[field] === 'object') {
        for (const param of Object.keys(req.body[field])) {
          if (JSON.stringify(req.body[field][param]) !== JSON.stringify(existingApplication[field][param])) {
            if (!updatedFields[field]) {
              updatedFields[field] = {};
            }
            updatedFields[field][param] = {
              oldValue: existingApplication[field][param],
              newValue: req.body[field][param],
            };
          }
        }
      }
    }

    if (req.body.full_name !== existingApplication.customfields.full_name) {
      if (!updatedFields.customfields) {
        updatedFields.customfields = {};
      }
      updatedFields.customfields.full_name = {
        oldValue: existingApplication.customfields.full_name,
        newValue: req.body.full_name,
      };
    }

    if (req.body.lead_id !== existingApplication.customfields.lead_id) {
      if (!updatedFields.customfields) {
        updatedFields.customfields = {};
      }
      updatedFields.customfields.lead_id = {
        oldValue: existingApplication.customfields.lead_id,
        newValue: req.body.lead_id,
      };
    }

    if (Object.keys(updatedFields).length > 0) {
      await ApplicationHistory.create({
        applicationId: req.params.id,
        updatedFields,
        updatedBy: req.user._id,
      });
    }

    // Send email based on payment status and sendfeeReciept conditions
    let emailSent = false;

    if (status === 'payment approved' && sendfeeReciept === 'yes') {
      if (university_name && institute_name) {
        const isValidUniversity = ['BOSSE', 'SPU', 'SVSU', 'MANGALAYATAN'].includes(university_name.toUpperCase());
        const isOnlineUniversity = ['MANGALAYATAN ONLINE'].includes(university_name.toUpperCase());

        if (institute_name === 'HES' && isValidUniversity) {
          emailSent = await HesMail(
            email,
            institute_name,
            dueAmount,
            req.body.full_name,
            req.body.education.course,
            req.body.customfields.father_name,
            req.body.customfields.dob,
            req.body.contact.phone,
            installment_type,
            totalCourseFee,
            totalPaidAmount,
            paid_amount,
            payment_type
          );
        } else if (institute_name === 'DES' && isValidUniversity) {
          emailSent = await DesMail(
            email,
            institute_name,
            dueAmount,
            req.body.full_name,
            req.body.education.course,
            req.body.customfields.father_name,
            req.body.customfields.dob,
            req.body.contact.phone,
            installment_type,
            totalCourseFee,
            totalPaidAmount,
            paid_amount,
            payment_type
          );
        } else if (institute_name === 'HES' && isOnlineUniversity) {
          emailSent = await HesMail(
            email,
            institute_name,
            dueAmount,
            req.body.full_name,
            req.body.education.course,
            req.body.customfields.father_name,
            req.body.customfields.dob,
            req.body.contact.phone,
            installment_type,
            totalCourseFee,
            totalPaidAmount,
            paid_amount,
            payment_type
          );
        } else if (institute_name === 'DES' && isOnlineUniversity) {
          emailSent = await DesMail(
            email,
            institute_name,
            dueAmount,
            req.body.full_name,
            req.body.education.course,
            req.body.customfields.father_name,
            req.body.customfields.dob,
            req.body.contact.phone,
            installment_type,
            totalCourseFee,
            totalPaidAmount,
            paid_amount,
            payment_type
          );
        }
      }
    } else {
      console.log(`Email not sent for application ${applicationId} because payment status is not 'payment approved' or 'sendfeeReciept' is not 'yes'`);
    }

    // Append newly uploaded images to existing ones
    if (feeDocument && Array.isArray(feeDocument)) {
      feeDocument.forEach((file) => {
        existingApplication.feeDocument.push(file);
      });
    }

    await existingApplication.save(); // Save the updated application

    return res.status(200).json({ success: true, message: `Successfully updated payment. Email sent: ${emailSent}` });
  } catch (error) {
    console.error("Error updating application:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = {
  updatePayment,
};
