const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const notificationService = require('./notificationServise');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/studentdocument');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '_' + Date.now() + ext);
  },
});

const upload = multer({ storage: storage }).single('image');

const create = async (Model, req, res) => {
  try {
    let studentEmail;
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          result: null,
          message: 'Error uploading image',
          error: err,
        });
      }

      const file = req.file;

      try {
        const newDoc = new Model(req.body);

        if (file) {
          const imgPath = path.join(process.cwd(), 'public/uploads/studentdocument', file.filename);

          const imgData = fs.readFileSync(imgPath);

          newDoc.img = {
            data: imgData,
            contentType: 'image/png',
          };
        }

        const {
          'contact.email': contactEmail,
          'customfields.counselor_email': counselorEmail,
          'customfields.send_fee_receipt': sendFeeReceipt,
          'education.course': course,
          'customfields.institute_name': institute,
          'customfields.father_name': fatherName,
          'customfields.dob': dob,
          'contact.phone': phoneNumber,
          'customfields.total_paid_amount': TotalAmount,
          'customfields.paid_amount': paidAmount,
        } = req.body;

        // Assign the value to studentEmail here
        studentEmail = contactEmail || (req.body.contact && req.body.contact.email) || null;

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'abhishek@edgetechnosoft.com',
            pass: 'zibs iflm rzwv dmgw',
          },
        });

        // Your validation logic for studentEmail or any other fields
        if (!validateGmail(studentEmail)) {
          return res.status(400).json({
            success: false,
            result: null,
            message: 'Invalid email address. Please use a Gmail address.',
          });
        }

        await notificationService.addNotification(
          'document',
          'add',
          `${newDoc.full_name}`,
          studentEmail // Pass studentEmail here
        );

        // Check if all data is correct
        if (
          !contactEmail ||
          !counselorEmail ||
          !sendFeeReceipt ||
          !course ||
          !institute ||
          !fatherName ||
          !dob ||
          !phoneNumber ||
          !TotalAmount ||
          !paidAmount
        ) {
          return res.status(400).json({
            success: false,
            result: null,
            message: 'Invalid or incomplete data. Please provide all required fields.',
          });
        }

        const result = await newDoc.save();
        let receiverEmail = `${studentEmail},${counselorEmail}`;

        if (
          institute &&
          typeof sendFeeReceipt !== 'undefined' &&
          sendFeeReceipt.toLowerCase() === 'yes'
        ) {
          // Load EJS template based on institute
          const templateFileName = `${institute.toLowerCase()}_template.ejs`;
          const templatePath = path.join(process.cwd(), 'email_templates', templateFileName);

          const ejsTemplate = fs.readFileSync(templatePath, 'utf-8');
          const renderedHtml = ejs.render(ejsTemplate, {
            full_name: req.body.full_name,
            course: course,
            father_name: fatherName,
            dob: dob,
            Total_Amount: TotalAmount,
            mobile_number: phoneNumber,
            email: contactEmail,
          });

          const mailOptions = {
            from: 'jadonabhishek332@gmail.com',
            to: receiverEmail,
            subject: `${institute} - New Document Created`,
            html: renderedHtml,
            attachments: [
              {
                filename: 'bg2.jpg',
                path: './email_templates/img/bg2.jpg',
                cid: 'bgImage', // Use the same CID as referenced in the EJS template
              },
              {
                filename: 'logo-higher.png',
                path: './email_templates/img/logo-higher.png',
                cid: 'hesLogo', // Use the same CID as referenced in the EJS template
              },
              {
                filename: 'paid.png',
                path: './email_templates/img/paid.png',
                cid: 'hesPaid', // Use the same CID as referenced in the EJS template
              },
              {
                filename: '5.png',
                path: './email_templates/img/5.png',
                cid: 'hesImg', // Use the same CID as referenced in the EJS template
              },
              // Add more attachments if needed
            ],
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

const validateGmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
  return regex.test(email);
};

module.exports = create;
