const ApplicationHistory = require('@/models/ApplicationHistory');
const { LMS } = require('@/models/Lms');
const User = require('@/models/User');
const axios = require('axios');
const moment = require('moment');
const HESEnrolled = require('@/emailTemplate/EnrolledTemplate/HESEnrolled');
const DESEnrolled = require('@/emailTemplate/EnrolledTemplate/DESEnrolled');

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

    const updatedDocumentData = { ...existingDocument._doc };
    if (req.body.customfields) {
      const customfields = { ...existingDocument.customfields };

      if (req.body.customfields.enrollment !== undefined) {
        customfields.enrollment = req.body.customfields.enrollment;
      }

      updatedDocumentData.customfields = { ...customfields, ...req.body.customfields };
    }

    let phoneNumbers = [];
    let targetEmails = [];

    if (updatedDocumentData.customfields.institute_name === 'HES') {
      targetEmails = ['aashita@erp.sode.co.in'];
    } else if (updatedDocumentData.customfields.institute_name === 'DES') {
      targetEmails = ['aashi@erp.sode.co.in'];
    }

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

    if (req.body.full_name !== undefined) {
      updatedDocumentData.full_name = req.body.full_name;
    }

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

    const totalCourseFee = parseFloat(updatedDocumentData.customfields.total_course_fee) || 0;
    const totalPaidAmount = parseFloat(updatedDocumentData.customfields.total_paid_amount) || 0;
    const dueAmount = totalCourseFee - totalPaidAmount;
    updatedDocumentData.customfields.due_amount = dueAmount.toString();

    const updatedDocument = await Model.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      updatedDocumentData,
      { new: true, runValidators: true }
    ).exec();

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

    if (Object.keys(updatedFields).length > 0) {
      await ApplicationHistory.create({
        applicationId: req.params.id,
        updatedFields,
        updatedBy: req.user._id,
      });
    }

    let whatsappMessageSent = false;
    let emailMessageSent = false;
    let whatsappMessage = '';
    let emailMessage = '';

    const hesUniversities = ['SPU', 'HU', 'BOSSE', 'MANGALAYATAN ONLINE', 'MANGALAYATAN DISTANCE'];
    const desUniversities = ['BOSSE', 'MANGALAYATAN ONLINE', 'MANGALAYATAN DISTANCE'];

    let sendPassword = '';
    if (hesUniversities.includes(updatedDocumentData.customfields.university_name) || desUniversities.includes(updatedDocumentData.customfields.university_name)) {
      sendPassword = moment(updatedDocumentData.customfields.dob).format('DDMMYYYY');
    } else if (['SVSU'].includes(updatedDocumentData.customfields.university_name)) {
      sendPassword = updatedDocumentData.contact.phone;
    }

    const universityUrlMap = {
      'SPU': 'https://www.spu.ac/f-tel/student_login.php',
      'HU': 'https://www.himalayanuniversity.com/student/student_login.php',
      'BOSSE': 'https://www.bosse.ac.in/student/student_login.php',
      'MANGALAYATAN ONLINE': 'https://www.muonline.ac.in/studentzone/',
      'MANGALAYATAN DISTANCE': 'https://www.mude.ac.in/studentzone/login.php',
      'SVSU': 'https://student.subhartide.com/auth/login',
    };

    if (
      ((updatedDocumentData.customfields.institute_name === 'HES' && hesUniversities.includes(updatedDocumentData.customfields.university_name)) ||
        (updatedDocumentData.customfields.institute_name === 'DES' && desUniversities.includes(updatedDocumentData.customfields.university_name))) &&
      updatedDocumentData.customfields.status === 'Enrolled'
    ) {
      if (updatedDocumentData.whatsappEnrolled === 'success') {
        whatsappMessage = 'WhatsApp message already sent successfully for this number.';
      } else {
        let gallaboxWebhookUrl = '';
        if (updatedDocumentData.customfields.institute_name === 'HES') {
          gallaboxWebhookUrl = 'https://server.gallabox.com/accounts/62e5204adcf80e00048761df/integrations/genericWebhook/666c11401508f3c7717e2bf5/webhook';
        } else if (updatedDocumentData.customfields.institute_name === 'DES') {
          gallaboxWebhookUrl = 'https://server.gallabox.com/accounts/61fce6fd9b042a00049ddbc1/integrations/genericWebhook/666c031621be75f64c34bb26/webhook';
        }

        const whatsappPayload = {
          lead_id: req.body.lead_id,
          full_name: req.body.full_name,
          email: req.body.contact.email,
          phone: req.body.contact.phone,
          course: req.body.education.course,
          enrollment: req.body.customfields.enrollment,
          institute_name: updatedDocumentData.customfields.institute_name,
          status: updatedDocumentData.customfields.status,
          password: sendPassword,
          URL: universityUrlMap[updatedDocumentData.customfields.university_name],
          tags: "Support Template",
          source: "Support Template",
        };

        if (updatedDocumentData.customfields.university_name) {
          whatsappPayload.university_name = updatedDocumentData.customfields.university_name;
        }

        console.log(`Sending WhatsApp message for application ${req.params.id}:`, whatsappPayload);

        try {
          await axios.post(gallaboxWebhookUrl, whatsappPayload);
          whatsappMessageSent = true;
          updatedDocumentData.whatsappEnrolled = 'success';

          await LMS.findByIdAndUpdate(
            { applicationId: req.params.id },
            { $push: { whatsappEnrolledment: { status: 'success', createdAt: new Date() } } }
          );
        } catch (whatsappError) {
          updatedDocumentData.whatsappEnrolled = 'failed';

          await LMS.findByIdAndUpdate(
            { applicationId: req.params.id },
            { $push: { whatsappEnrolledment: { status: 'failed', errorMessage: whatsappError.message, createdAt: new Date() } } }
          );

          console.error(`Error sending WhatsApp message for application ${req.params.id}:`, whatsappError);
        }

        await Model.findByIdAndUpdate(req.params.id, { whatsappEnrolled: updatedDocumentData.whatsappEnrolled }).exec();
      }

      if (updatedDocumentData.welcomeEnrolled === 'success') {
        emailMessage = 'Email already sent successfully for this number.';
      } else {
        let emailPayload;
        if (updatedDocumentData.customfields.institute_name === 'HES') {
          emailPayload = HESEnrolled({
            full_name: req.body.full_name,
            email: req.body.contact.email,
            phone: req.body.contact.phone,
            course: req.body.education.course,
            enrollment: req.body.customfields.enrollment,
            institute_name: updatedDocumentData.customfields.institute_name,
            status: updatedDocumentData.customfields.status,
            password: sendPassword,
            URL: universityUrlMap[updatedDocumentData.customfields.university_name],
          });
        } else if (updatedDocumentData.customfields.institute_name === 'DES') {
          emailPayload = DESEnrolled({
            full_name: req.body.full_name,
            email: req.body.contact.email,
            phone: req.body.contact.phone,
            course: req.body.education.course,
            enrollment: req.body.customfields.enrollment,
            institute_name: updatedDocumentData.customfields.institute_name,
            status: updatedDocumentData.customfields.status,
            password: sendPassword,
            URL: universityUrlMap[updatedDocumentData.customfields.university_name],
          });
        }

        console.log(`Sending Email for application ${req.params.id}:`, emailPayload);

        try {
          await emailPayload;
          emailMessageSent = true;
          updatedDocumentData.welcomeEnrolled = 'success';

          await LMS.updateOne(
            { applicationId: req.params.id },
            { $push: { emailEnrolledment: { status: 'success', createdAt: new Date() } } }
          );
        } catch (emailError) {
          updatedDocumentData.welcomeEnrolled = 'failed';

          await LMS.updateOne(
            { applicationId: req.params.id },
            { $push: { emailEnrolledment: { status: 'failed', errorMessage: emailError.message, createdAt: new Date() } } }
          );
          console.error(`Error sending Email for application ${req.params.id}:`, emailError);
        }

        await Model.findByIdAndUpdate(req.params.id, { welcomeEnrolled: updatedDocumentData.welcomeEnrolled }).exec();
      }

    } else {
      whatsappMessage = `University ${updatedDocumentData.customfields.university_name} is not eligible for WhatsApp enrollment.`;
      emailMessage = `University ${updatedDocumentData.customfields.university_name} is not eligible for Email enrollment.`;
      console.log(whatsappMessage);
      console.log(emailMessage);
    }

    return res.status(200).json({
      success: true,
      result: updatedDocument,
      message: whatsappMessageSent && emailMessageSent
        ? "Document updated, WhatsApp message, and email sent successfully"
        : whatsappMessageSent
          ? "Document updated and WhatsApp message sent successfully"
          : emailMessageSent
            ? "Document updated and email sent successfully"
            : `Document updated successfully. ${whatsappMessage} ${emailMessage}`,
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
