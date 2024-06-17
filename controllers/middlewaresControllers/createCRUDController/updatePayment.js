const { Applications } = require('@/models/Application');
const ApplicationHistory = require('@/models/ApplicationHistory');
const DesMail = require('@/emailTemplate/paymentEmail/DesMail');
const HesMail = require('@/emailTemplate/paymentEmail/HesMail');
const { WelcomeMail } = require('@/emailTemplate/welcomeEmail');
const { LMS } = require('@/models/Lms');
const axios = require('axios'); // Import axios for HTTP requests
const User = require('@/models/User');

async function updatePayment(req, res) {
  try {
    const applicationId = req.params.id;
    const customfields = req.body.customfields;
    const contact = req.body.contact;
    const whatsappWelcome = req.body.whatsappWelcome;
    const welcome = req.body.welcome;
    const { feeDocument } = req.imageUrls;


    const { email } = contact;
    const { paid_amount, installment_type, paymentStatus, payment_mode, payment_type, institute_name, university_name, sendfeeReciept, session } = customfields;
    const status = paymentStatus ? paymentStatus.toLowerCase() : '';

    // Fetch user phone numbers based on institute name condition
    let phoneNumbers = [];
    let targetEmails = [];

    if (institute_name === 'HES') {
      targetEmails = ['aashita@erp.sode.co.in'];
    } else if (institute_name === 'DES') {
      targetEmails = ['jadonabhishek332@gmail.com'];
    }

    // Fetch users based on targetEmails
    for (const targetEmail of targetEmails) {
      try {
        const user = await User.findOne({ username: targetEmail }).exec();
        if (user && user.phone) {
          phoneNumbers.push(user.phone);
        } else {
          console.log(`User with email ${targetEmail} not found or phone number not available.`);
        }
      } catch (error) {
        console.error(`Error fetching user for email ${targetEmail}:`, error);
      }
    }

    const existingApplication = await Applications.findById(applicationId);
    if (!existingApplication) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const oldValues = { ...existingApplication.toObject() }; // Store current values
    const currentPaymentStatus = existingApplication.customfields.paymentStatus;

    // Validate payment status updates
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

    if (currentPaymentStatus === 'payment rejected' && status === 'payment approved') {
      return res.status(400).json({
        success: false,
        message: "Cannot update application because the payment status is 'payment rejected'. Change the status to payment received.",
      });
    }

    // Apply updates to the customfields
    const updatedCustomFields = {};
    if (status === 'payment received') {
      if (currentPaymentStatus !== 'payment approved' && currentPaymentStatus !== 'payment rejected') {
        return res.status(400).json({
          success: false,
          message: "Cannot mark as 'payment received' unless the previous status was 'payment approved' or 'payment rejected'.",
        });
      }

      if (currentPaymentStatus === 'payment approved') {
        if (installment_type !== undefined) {
          const previousInstallments = existingApplication.previousData
            .filter((entry) => entry.paymentStatus === 'payment received')
            .map((entry) => entry.installment_type);

          if (previousInstallments.includes(installment_type)) {
            return res.status(400).json({
              success: false,
              message: `Installment ${installment_type} already exists. Add a different installment or update the existing one.`,
            });
          }

          existingApplication.customfields.installment_type = installment_type;
          updatedCustomFields.installment_type = installment_type;
        }
      }

      if (paid_amount !== undefined) {
        const amountToAdd = parseFloat(paid_amount);

        if (isNaN(amountToAdd)) {
          return res.status(400).json({ success: false, message: "Invalid numerical data for paid amount" });
        }

        let totalPaidAmount = parseFloat(existingApplication.customfields.total_paid_amount);

        if (isNaN(totalPaidAmount)) {
          return res.status(400).json({ success: false, message: "Invalid total paid amount" });
        }

        totalPaidAmount += amountToAdd;
        existingApplication.customfields.total_paid_amount = totalPaidAmount;
        updatedCustomFields.paid_amount = amountToAdd;
      }
    }

    if (status === 'payment rejected') {
      if (currentPaymentStatus !== 'payment approved' && currentPaymentStatus !== 'payment received') {
        return res.status(400).json({
          success: false,
          message: "Cannot mark as 'payment rejected' unless the previous status was 'payment approved' or 'payment received'.",
        });
      }

      if (paid_amount !== undefined) {
        const amountToSubtract = parseFloat(paid_amount);

        if (isNaN(amountToSubtract)) {
          return res.status(400).json({ success: false, message: "Invalid numerical data for paid amount" });
        }

        let totalPaidAmount = parseFloat(existingApplication.customfields.total_paid_amount);

        if (isNaN(totalPaidAmount)) {
          return res.status(400).json({ success: false, message: "Invalid total paid amount" });
        }
        totalPaidAmount -= amountToSubtract;
        existingApplication.customfields.total_paid_amount = totalPaidAmount;
        updatedCustomFields.paid_amount = -amountToSubtract;
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
      existingApplication.customfields.sendfeeReciept = sendfeeReciept;
      updatedCustomFields.sendfeeReciept = sendfeeReciept;
    }

    if (paid_amount !== undefined) {
      existingApplication.customfields.paid_amount = paid_amount;
      updatedCustomFields.paid_amount = paid_amount;
    }

    // Calculate due amount
    const totalCourseFee = parseFloat(existingApplication.customfields.total_course_fee);
    const totalPaidAmount = parseFloat(existingApplication.customfields.total_paid_amount);
    const dueAmount = totalCourseFee - totalPaidAmount;

    existingApplication.customfields.due_amount = dueAmount;

    // Append to previousData
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

    // Find out what fields were updated and add them to the history
    const updatedFields = {};

    // Check changes in customfields
    for (const [key, newValue] of Object.entries(req.body.customfields)) {
      const oldValue = oldValues.customfields[key];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        if (!updatedFields.customfields) {
          updatedFields.customfields = {};
        }
        updatedFields.customfields[key] = {
          oldValue,
          newValue
        };
      }
    }

    // If there are any updates, create a history record
    if (Object.keys(updatedFields).length > 0) {
      await ApplicationHistory.create({
        applicationId: applicationId,
        updatedFields,
        updatedBy: req.user._id
      });
    }

    // Send email based on payment status and sendfeeReciept conditions
    let emailSent = false;

   if (status === 'payment approved' && sendfeeReciept.toLowerCase() === 'yes') {
      if (university_name && institute_name) {
        if (institute_name === 'HES' && ['BOSSE', 'SPU', 'SVSU', 'MANGALAYATAN DISTANCE', 'SGVU', 'HU'].includes(university_name.toUpperCase())) {
          emailSent = await HesMail(email, institute_name, dueAmount, req.body.full_name, req.body.education.course, req.body.customfields.father_name, req.body.customfields.dob, req.body.contact.phone, installment_type, totalCourseFee, totalPaidAmount, paid_amount);
        } else if (institute_name === 'DES' && ['BOSSE', 'SPU', 'SVSU', 'MANGALAYATAN DISTANCE', 'SGVU', 'HU'].includes(university_name.toUpperCase())) {
          emailSent = await DesMail(email, institute_name, dueAmount, req.body.full_name, req.body.education.course, req.body.customfields.father_name, req.body.customfields.dob, req.body.contact.phone, installment_type, req.body.customfields.payment_type, totalCourseFee, totalPaidAmount, paid_amount);
        } else if (institute_name === 'HES' && university_name.toUpperCase() === 'MANGALAYATAN ONLINE' && (session.toUpperCase() === 'JULY 23' || session.toUpperCase() === 'JAN 24')) {
          emailSent = await HesMail(email, institute_name, dueAmount, req.body.full_name, req.body.education.course, req.body.customfields.father_name, req.body.customfields.dob, req.body.contact.phone, installment_type, totalCourseFee, totalPaidAmount, paid_amount);
        } else if (institute_name === 'DES' && university_name.toUpperCase() === 'MANGALAYATAN ONLINE' && (session.toUpperCase() === 'JULY 23' || session.toUpperCase() === 'JAN 24')) {
          emailSent = await DesMail(email, institute_name, dueAmount, req.body.full_name, req.body.education.course, req.body.customfields.father_name, req.body.customfields.dob, req.body.contact.phone, installment_type, req.body.customfields.payment_type, totalCourseFee, totalPaidAmount, paid_amount);
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

    // Check and send WelcomeMail
    let welcomeMailSent = false;
    if (status === 'payment approved'  && welcome === 'yes' ) {
      const lmsEntry = await LMS.findOne({ applicationId });
      if (lmsEntry) {
        const alreadySent = lmsEntry.welcomeMailStatus.some(
          (entry) => entry.status === 'success'
        );

        if (alreadySent) {
          console.log(`Welcome mail already sent successfully for application ${applicationId}`);
        } else {
          try {
            await WelcomeMail(req.body.full_name, email);
            welcomeMailSent = true;
            await LMS.updateOne(
              { applicationId },
              { $push: { welcomeMailStatus: { status: 'success', createdAt: new Date() } } }
            );
          } catch (welcomeMailError) {
            await LMS.updateOne(
              { applicationId },
              { $push: { welcomeMailStatus: { status: 'failed', errorMessage: welcomeMailError.message, createdAt: new Date() } } }
            );
            console.error(`Error sending welcome mail for application ${applicationId}:`, welcomeMailError);
          }
        }
      } else {
        // Create a new LMS entry if it does not exist
        try {
          await LMS.create({
            applicationId,
            status: 'initialized',
            data: [],
            emailStatuses: [],
            welcomeMailStatus: [{ status: 'success', createdAt: new Date() }]
          });
          welcomeMailSent = true;
          await WelcomeMail(req.body.full_name, email);
        } catch (welcomeMailError) {
          await LMS.create({
            applicationId,
            status: 'initialized',
            data: [],
            emailStatuses: [],
            welcomeMailStatus: [{ status: 'failed', errorMessage: welcomeMailError.message, createdAt: new Date() }]
          });
          console.error(`Error sending welcome mail for application ${applicationId}:`, welcomeMailError);
        }
      }
    }

// Set welcomeMail field based on welcomeMailSent
existingApplication.welcomeMail = welcomeMailSent ? 'Yes' : 'No';

    if (status === 'payment approved' && whatsappWelcome === 'yes' ) {
      // Send WhatsApp message based on institute name
      let gallaboxWebhookUrl = '';
      if (institute_name === 'HES') {
        gallaboxWebhookUrl = 'https://server.gallabox.com/accounts/62e5204adcf80e00048761df/integrations/genericWebhook/6651aecee5e9efbf11651770/webhook';
      } else if (institute_name === 'DES') {
        gallaboxWebhookUrl = 'https://server.gallabox.com/accounts/61fce6fd9b042a00049ddbc1/integrations/genericWebhook/6651896de5e9efbf1160ab63/webhook';
      }

      let whatsappMessageSent = false;

      // Initialize whatsappMessageStatus if undefined
      if (!existingApplication.whatsappMessageStatus) {
        existingApplication.whatsappMessageStatus = 'pending';
      }

      if (existingApplication.whatsappMessageStatus !== 'success') {
        try {
          const whatsappPayload = {
            lead_id: applicationId,
            full_name: req.body.full_name,
            contact: {
              email: contact.email,
              phone: contact.phone,
            },
            education: {
              course: req.body.education.course,
            },
            customfields: {
              institute_name: customfields.institute_name,
              university_name: customfields.university_name,
              tags: "Support Template",
              source: "Support Template",
            },
            userId: {
              phone: [phoneNumbers]
            }
          };

          await axios.post(gallaboxWebhookUrl, whatsappPayload);

          whatsappMessageSent = true;
          existingApplication.whatsappMessageStatus = 'success';

          // Update WhatsApp status in LMS model
          await LMS.updateOne(
            { applicationId },
            { $push: { whatsappStatuses: { status: 'success', createdAt: new Date() } } }
          );
        } catch (whatsappError) {
          existingApplication.whatsappMessageStatus = 'failed';

          // Update WhatsApp status with error in LMS model
          await LMS.updateOne(
            { applicationId },
            { $push: { whatsappStatuses: { status: 'failed', errorMessage: whatsappError.message, createdAt: new Date() } } }
          );

          console.error(`Error sending WhatsApp message for application ${applicationId}:`, whatsappError);
        }
      } else {
        console.log(`WhatsApp message already sent successfully for application ${applicationId}`);
      }
    }

    await existingApplication.save(); // Save the updated application

    return res.status(200).json({ success: true, message: `Successfully updated payment.` });
  } catch (error) {
    console.error("Error updating application:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = {
  updatePayment,
};
