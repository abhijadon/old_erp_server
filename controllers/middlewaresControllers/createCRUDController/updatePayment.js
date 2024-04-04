const { Applications } = require('@/models/Application');
const ApplicationHistory = require('@/models/ApplicationHistory');
const sendEmail = require('@/emailTemplate/SendEmailTemplate');

async function updatePayment(req, res) {
  try {
    const applicationId = req.params.id;
    const customfields = req.body.customfields;

    // Check if customfields is defined and is an object
    if (!customfields || typeof customfields !== 'object') {
      return res.status(400).json({ success: false, message: "Invalid customfields data" });
    }

    const { paid_amount, installment_type, paymentStatus, payment_mode, payment_type } = customfields;

    // Check if paymentStatus is defined and convert to lowercase
    const status = paymentStatus ? paymentStatus.toLowerCase() : '';

    // Check if paymentStatus is valid
    if (status !== 'payment approved' && status !== 'payment received' && status !== 'payment rejected') {
      return res.status(400).json({ success: false, message: "Invalid paymentStatus" });
    }

    const existingApplication = await Applications.findById(applicationId);

    if (!existingApplication) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const oldValues = JSON.parse(JSON.stringify(existingApplication._doc));
    req.body.removed = false;
    const updatedBy = req.user._id;

    const updatedCustomFields = {};

    if (status === 'payment received') {
      if (paid_amount !== undefined) {
        existingApplication.customfields.total_paid_amount += parseInt(paid_amount);
        existingApplication.customfields.paid_amount = paid_amount;
        updatedCustomFields.paid_amount = paid_amount;
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

    const totalCourseFee = parseFloat(existingApplication.customfields.total_course_fee);
    const totalPaidAmount = parseFloat(existingApplication.customfields.total_paid_amount);
    const dueAmount = totalCourseFee - totalPaidAmount;

    existingApplication.customfields.due_amount = dueAmount;

    existingApplication.previousData.push({
      installment_type: installment_type,
      paymentStatus: status,
      payment_mode: payment_mode,
      payment_type: payment_type,
      total_paid_amount: totalPaidAmount,
      total_course_fee: totalCourseFee,
      paid_amount: paid_amount,
      due_amount: dueAmount,
      date: new Date()
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

    if (Object.keys(updatedFields).length > 0) {
      await ApplicationHistory.create({
        applicationId: req.params.id,
        updatedFields,
        updatedBy: req.user._id
      });
    }

    if (status === 'payment approved') {
      const receiverEmail = existingApplication.contact.email;
      const formData = {
        full_name: req.body.full_name,
        contact: req.body.contact,
        customfields: req.body.customfields,
        education: req.body.education || { course: 'Unknown' } // Default value if education is undefined
      };
      const dueAmount = existingApplication.customfields.due_amount;
      
      let institute = existingApplication.customfields.institute_name === 'HES' ? 'HES' : 'DES';
      
      await sendEmail(receiverEmail, institute, formData, dueAmount);
    }

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
