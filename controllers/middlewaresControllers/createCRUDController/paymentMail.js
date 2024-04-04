const fs = require('fs');
const nodemailer = require('nodemailer');

async function sendEmail(receiverEmail, data, isUpdate = false) {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'abhishek@edgetechnosoft.com',
        pass: 'zibs iflm rzwv dmgw',
      },
    });

    let html;
    if (isUpdate) {
      html = generateUpdateEmailTemplate(data);
    } else {
      html = generateCreationEmailTemplate(data);
    }

    let mailOptions = {
      from: 'abhishek@edgetechnosoft.com',
      to: receiverEmail,
      subject: 'Payment Update Notification',
      html: html
    };

    let info = await transporter.sendMail(mailOptions);

    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

function generateCreationEmailTemplate(data) {
  let html = fs.readFileSync('creation_email_template.html', 'utf8');
  // Replace placeholders with actual data
  for (let key in data) {
    let regex = new RegExp('\\[' + key + '\\]', 'g');
    html = html.replace(regex, data[key]);
  }
  return html;
}

function generateUpdateEmailTemplate(data) {
  let html = fs.readFileSync('update_email_template.html', 'utf8');
  // Replace placeholders with actual data
  for (let key in data) {
    let regex = new RegExp('\\[' + key + '\\]', 'g');
    html = html.replace(regex, data[key]);
  }
  return html;
}

module.exports = sendEmail;
