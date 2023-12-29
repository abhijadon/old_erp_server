const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/studentdocument');
  },
  filename: (req, file, cb) => {
    // Include the file extension in the filename
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '_' + Date.now() + ext);
  },
});

const upload = multer({ storage: storage }).single('image');

const create = async (Model, req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          result: null,
          message: 'Error uploading image',
          error: err,
        });
      }

      // Get image file details
      const file = req.file;

      try {
        const newDoc = new Model(req.body);

        if (file) {
          const imgPath = path.join(
            process.cwd(), // This gets the current working directory
            'public/uploads/studentdocument',
            file.filename
          );

          const imgData = fs.readFileSync(imgPath);

          newDoc.img = {
            data: imgData,
            contentType: 'image/png',
          };
        }

        const result = await newDoc.save();

        // Rest of logic for sending mail
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
        } else if (error.code === 11000) {
          const duplicateKeyField = Object.keys(error.keyPattern)[0];
          const duplicateKeyValue = error.keyValue[duplicateKeyField];

          let errorMessage;
          if (duplicateKeyField === 'email') {
            errorMessage = 'This email is duplicate, please try another email.';
          } else if (duplicateKeyField === 'phone') {
            errorMessage = 'This phone number is duplicate, please try another phone number.';
          } else {
            errorMessage = 'Duplicate key error.';
          }

          return res.status(400).json({
            success: false,
            result: null,
            message: errorMessage,
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

module.exports = create;
