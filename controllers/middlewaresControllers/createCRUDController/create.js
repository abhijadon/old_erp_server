const nodemailer = require('nodemailer');

const create = async (Model, req, res) => {
  try {
    const result = await new Model(req.body).save();

    const {
      customfields,
      contact,
      education,
      'contact.email': contactEmail,
      'customfields.counselor_email': counselorEmail,
      'customfields.send_fee_receipt': sendFeeReceipt,
      'education.course': course,
      'customfields.institute_name': institute,
    } = req.body;

    const institutes = customfields ? customfields.institute_name : null;
    const studentEmail = contactEmail || (contact && contact.email) || null;
    const courses = education && education.course ? education.course : null;

    console.log('sendFeeReceipt:', sendFeeReceipt);
    console.log('institute:', institute);
    console.log('studentEmail:', studentEmail);
    console.log('counselorEmail:', counselorEmail);
    console.log('course:', course);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'abhishek@edgetechnosoft.com',
        pass: 'zibs iflm rzwv dmgw',
      },
    });

    let receiverEmail = `${studentEmail},${counselorEmail}`;

    const emailTemplates = {
      HES: {
        subject: 'HES - New Document Created',
        html: `<p>This is the HES template for a new document...</p>`,
      },
      DES: {
        subject: 'DES - New Document Created',
        html: `<p>This is the DES template for a new document...</p>`,
      },
    };

    if (
      institute &&
      typeof sendFeeReceipt !== 'undefined' &&
      sendFeeReceipt.toLowerCase() === 'yes' &&
      emailTemplates[institute]
    ) {
      const mailContent = emailTemplates[institute];
      const mailOptions = {
        from: 'jadonabhishek332@gmail.com',
        to: receiverEmail,
        subject: mailContent.subject,
        html: mailContent.html,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        success: true,
        result,
        message: `Successfully created the document in Model and sent ${institute} email notification`,
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: `Document created in Model, but ${institute} email notification not sent or sendfeereceipt is not set to 'Yes'`,
      });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: error,
      });
    } else {
      return res.status(500).json({
        success: false,
        result: null,
        message: error.message,
        error: error,
      });
    }
  }
};

module.exports = create;
