const { Applications } = require('@/models/Application');
const ApplicationHistory = require('@/models/ApplicationHistory');
const DesMail = require('@/emailTemplate/paymentEmail/DesMail');
const HesMail = require('@/emailTemplate/paymentEmail/HesMail');

async function updatePayment(req, res) {
  try {
    const applicationId = req.params.id;
    const customfields = req.body.customfields;
    const contact = req.body.contact;
    const { feeDocument } = req.imageUrls;

    if (!customfields || typeof customfields !== 'object') {
      return res.status(400).json({ success: false, message: "Invalid customfields data" });
    }

    const { email } = contact;
    const { paid_amount, installment_type, paymentStatus, payment_mode, payment_type, institute_name, university_name, session, sendfeeReciept } = customfields;

   const status = paymentStatus ? paymentStatus.toLowerCase() : '';
const sendFeeReciept = sendfeeReciept ? sendfeeReciept.toLowerCase() : '';
   
console.log('Payment Status:', status);
console.log('Send Fee Receipt:', sendFeeReciept);


    if (status !== 'payment approved' && status !== 'payment received' && status !== 'payment rejected') {
      return res.status(400).json({ success: false, message: "Invalid paymentStatus" });
    }

    const existingApplication = await Applications.findById(applicationId);

    if (!existingApplication) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const oldValues = JSON.parse(JSON.stringify(existingApplication._doc));
    req.body.removed = false;

    const updatedCustomFields = {};
    
if (status === 'payment received') {
  if (paid_amount !== undefined) {
    // Convert paid_amount to a floating-point number
    const amountToAdd = parseFloat(paid_amount);
    
    // Ensure total_paid_amount is also a number
    let totalPaidAmount = parseFloat(existingApplication.customfields.total_paid_amount);

    if (isNaN(totalPaidAmount) || isNaN(amountToAdd)) {
      return res.status(400).json({ success: false, message: "Invalid numerical data" });
    }

    // Correctly increment total paid amount
    totalPaidAmount += amountToAdd;

    existingApplication.customfields.total_paid_amount = totalPaidAmount;
    existingApplication.customfields.paid_amount = amountToAdd;

    updatedCustomFields.paid_amount = amountToAdd;
  }
}

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
    if (sendfeeReciept !== undefined) {
      existingApplication.customfields.sendfeeReciept = sendFeeReciept;
      updatedCustomFields.sendfeeReciept = sendFeeReciept;
    }

    const totalCourseFee = parseFloat(existingApplication.customfields.total_course_fee);
    const totalPaidAmount = parseFloat(existingApplication.customfields.total_paid_amount);
    const dueAmount = totalCourseFee - totalPaidAmount;

    existingApplication.customfields.due_amount = dueAmount;

    existingApplication.previousData.push({
      installment_type: installment_type,
      paymentStatus: status,
      sendfeeReciept: sendFeeReciept,
      payment_mode: payment_mode,
      payment_type,
      total_course_fee: totalCourseFee,
      total_paid_amount: totalPaidAmount,
      paid_amount,
      due_amount: dueAmount,
      date: new Date(),
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
              newValue: req.body[field][param],
            };
          }
        }
      }
    }

    if (req.body.full_name !== oldValues.full_name) {
      if (!updatedFields.customfields) {
        updatedFields.customfields = {};
      }
      updatedFields.customfields.full_name = {
        oldValue: oldValues.full_name,
        newValue: req.body.full_name,
      };
    }

    if (req.body.lead_id !== oldValues.lead_id) {
      if (!updatedFields.customfields) {
        updatedFields.customfields = {};
      }
      updatedFields.customfields.lead_id = {
        oldValue: oldValues.lead_id,
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

    let emailSent = false;

    // Only send email if payment status is 'payment approved' AND sendfeeReciept is 'yes'
    if (status === 'payment approved' && sendFeeReciept === 'yes') {
      if (university_name && institute_name) {
        const isValidUniversity = ['BOSSE', 'SPU', 'SVSU', 'MANGALAYATAN'].includes(university_name.toUpperCase());
        const isOnlineUniversity = ['MANGALAYATAN ONLINE'].includes(university_name.toUpperCase());

        if (institute_name === 'HES' && isValidUniversity) {
          emailSent = await HesMail(email, institute_name, dueAmount, req.body.full_name, req.body.education.course, req.body.customfields.father_name, req.body.customfields.dob, req.body.contact.phone, installment_type, totalCourseFee, totalPaidAmount, paid_amount, payment_type);
        } else if (institute_name === 'DES' && isValidUniversity) {
          emailSent = await DesMail(email, institute_name, dueAmount, req.body.full_name, req.body.education.course, req.body.customfields.father_name, req.body.customfields.dob, req.body.contact.phone, installment_type, totalCourseFee, totalPaidAmount, paid_amount, payment_type);
        } else if (institute_name === 'HES' && isOnlineUniversity) {
          emailSent = await HesMail(email, institute_name, dueAmount, req.body.full_name, req.body.education.course, req.body.customfields.father_name, req.body.customfields.dob, req.body.contact.phone, installment_type, totalCourseFee, totalPaidAmount, paid_amount, payment_type);
        } else if (institute_name === 'DES' && isOnlineUniversity) {
          emailSent = await DesMail(email, institute_name, dueAmount, req.body.full_name, req.body.education.course, req.body.customfields.father_name, req.body.customfields.dob, req.body.contact.phone, installment_type, totalCourseFee, totalPaidAmount, paid_amount, payment_type);
        }
      }
    } else {
      console.log(`Email not sent for application ${applicationId} because payment status is not 'payment approved' or 'sendfeeReciept' is not 'yes'`);
    }

    if (feeDocument && Array.isArray(feeDocument)) {
      // Append newly uploaded images to existing ones
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
