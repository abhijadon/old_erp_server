const { Applications } = require('@/models/Application');
const DesMail = require('@/emailTemplate/paymentEmail/DesMail');
const HesMail = require('@/emailTemplate/paymentEmail/HesMail');

async function resendPaymentEmail(req, res) {
  console.log('req.body', req.body)
  try {
    const applicationId = req.params.id;
    const { customfields } = req.body;

    const application = await Applications.findById(applicationId);
    if (!application) {
      console.error("Application not found:", applicationId);
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const email = req.body.contact.email

    const { paid_amount, installment_type, institute_name, paymentStatus, university_name, sendfeeReciept, session } = customfields;

    const status = paymentStatus ? paymentStatus.toLowerCase() : '';

    // Calculate due amount
    const totalCourseFee = parseFloat(customfields.total_course_fee);
    const totalPaidAmount = parseFloat(customfields.total_paid_amount);
    const dueAmount = totalCourseFee - totalPaidAmount;

    customfields.due_amount = dueAmount;
    // Send email based on payment status and sendfeeReciept conditions
    let emailSent = false;

    if (status === 'payment approved') {
      if (university_name && institute_name) {
        if (institute_name === 'HES' && ['BOSSE', 'SPU', 'SVSU', 'MANGALAYATAN DISTANCE'].includes(university_name)) {
          emailSent = await HesMail(email, institute_name, dueAmount, req.body.full_name, req.body.education.course, req.body.customfields.father_name, req.body.customfields.dob, req.body.contact.phone, installment_type, totalCourseFee, totalPaidAmount, paid_amount);
        } else if (institute_name === 'DES' && ['BOSSE', 'SPU', 'SVSU', 'MANGALAYATAN DISTANCE'].includes(university_name)) {
          emailSent = await DesMail(email, institute_name, dueAmount, req.body.full_name, req.body.education.course, req.body.customfields.father_name, req.body.customfields.dob, req.body.contact.phone, installment_type, totalCourseFee, totalPaidAmount, paid_amount);
        } else if (institute_name === 'HES' && university_name === 'MANGALAYATAN ONLINE' && (session === 'JULY 23' || session === 'JAN 24')) {
          emailSent = await HesMail(email, institute_name, dueAmount, req.body.full_name, req.body.education.course, req.body.customfields.father_name, req.body.customfields.dob, req.body.contact.phone, installment_type, totalCourseFee, totalPaidAmount, paid_amount);
        } else if (institute_name === 'DES' && university_name === 'MANGALAYATAN ONLINE' && (session === 'JULY 23' || session === 'JAN 24')) {
          emailSent = await DesMail(email, institute_name, dueAmount, req.body.full_name, req.body.education.course, req.body.customfields.father_name, req.body.customfields.dob, req.body.contact.phone, installment_type, totalCourseFee, totalPaidAmount, paid_amount);
        }
      }
    } else {
      console.log(`Email not sent for application ${applicationId} because payment status is not 'payment approved' or 'sendfeeReciept' is not 'yes'`);
    }

    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: "Email successfully resent.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Could not resend email.",
      });
    }

  } catch (error) {
    console.error("Error in resendPaymentEmail:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

module.exports = {
  resendPaymentEmail,
};
