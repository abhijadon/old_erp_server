const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const sendEmail = async (receiverEmail, institute, studentData, operationType) => {
  try {
    let attachments = [];

    if (institute.toLowerCase() === 'hes') {
      attachments = [
        { filename: 'bg2.jpg', path: './email_templates/img/bg2.jpg', cid: 'bgImage' },
        { filename: 'logo-higher.png', path: './email_templates/img/logo-higher.png', cid: 'hesLogo' },
        { filename: 'paid.png', path: './email_templates/img/paid.png', cid: 'hesPaid' },
        { filename: '5.png', path: './email_templates/img/5.png', cid: 'hesImg' },
        // Add more attachments if needed
      ];
    } else if (institute.toLowerCase() === 'des') {
      attachments = [
        { filename: 'bg2.jpg', path: './email_templates/img/bg2.jpg', cid: 'bgImage' },
        // Attach DES-specific images here
      ];
    }

    const templateFileName = institute.toLowerCase() === 'des' ? 'des_template.ejs' : 'hes_template.ejs';
    const templatePath = path.join(process.cwd(), 'email_templates', templateFileName);
    const ejsTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Customize email content based on operation type
    let emailSubject = '';
    let emailMessage = '';

    if (operationType === 'create') {
      emailSubject = `${institute} - New Document Created`;
      emailMessage = 'Document created successfully.';
    } else if (operationType === 'update') {
      emailSubject = `${institute} - Document Updated`;
      emailMessage = 'Document updated successfully.';
    }

    const renderedHtml = ejs.render(ejsTemplate, {
      full_name: studentData.full_name,
      course: studentData.education ? studentData.education.course : '', // Ensure education object exists
      father_name: studentData.customfields.father_name,
      dob: studentData.customfields.dob,
      Total_Amount: studentData.customfields.total_paid_amount,
      paidAmount: studentData.customfields.paid_amount,
      mobile_number: studentData.contact.phone,
      email: studentData.contact.email,
      message: emailMessage, // Include email message in the template
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'abhishek@edgetechnosoft.com',
        pass: 'zibs iflm rzwv dmgw',
      },
    });

    const mailOptions = {
      from: 'jadonabhishek332@gmail.com',
      to: receiverEmail,
      subject: emailSubject,
      html: renderedHtml,
      attachments: attachments,
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = sendEmail;
