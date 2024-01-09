const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const ejs = require('ejs');
const pdf = require('html-pdf');
const PaymentModel = mongoose.model('Payment');

const mail = async (req, res) => {
  try {
    const { id } = req.body;

    // Throw error if no id
    if (!id) {
      throw { name: 'ValidationError' };
    }

    const result = await PaymentModel.findOne({ _id: id, removed: false }).exec();

    // Throw error if no result
    if (!result) {
      throw { name: 'ValidationError' };
    }

    const { student_name, total_paid_amount, email } = result;

    // Compile EJS template with dynamic data
    const htmlContent = ejs.render(`
      <html>
        <body>
          <p>Hello ${student_name},</p>
          <p>Your payment of ${total_paid_amount} has been received. Thank you!</p>
        </body>
      </html>
    `);

    // Set up PDF options
    const pdfOptions = {
      format: 'Letter',
      border: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm',
      },
    };

    // Generate PDF from HTML
    const pdfBuffer = await new Promise((resolve, reject) => {
      pdf.create(htmlContent, pdfOptions).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'abhishek@edgetechnosoft.com',
        pass: 'zibs iflm rzwv dmgw',
      },
    });

    // Create email options
    const mailOptions = {
      from: 'abhishek@edgetechnosoft.com',
      to: 'abhisheksode001@gmail.com',
      subject: 'Payment From SODE',
      html: `Hello ${student_name},\n\nYour payment of ${total_paid_amount} has been received. Thank you!`,
      attachments: [
        {
          filename: 'PaymentReceipt.pdf',
          content: pdfBuffer,
          encoding: 'base64',
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      result: info,
      message: `Successfully sent Payment with PDF attachment`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = mail;
