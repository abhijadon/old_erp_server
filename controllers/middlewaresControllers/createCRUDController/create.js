const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/studentdocument'); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// Upload middleware
const upload = multer({ storage }).single('image');

const create = async (Model, req, res) => {
  try {
    // Handle image upload
    upload(req, res, async function (err) {
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

      // Create a new document and save image reference if available
      const newDoc = new Model(req.body);
      if (file) {
        // Assuming 'image' field is present in your Model schema
        newDoc.image = file.path; // Save the image path to the 'image' field in the database
      }

      try {
        const result = await newDoc.save();

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
            message: `Successfully created the document in Model and ${
              file ? 'sent email notification' : 'did not attach an image'
            }`,
          });
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          result: null,
          message: error.message,
          error: error,
        });
      }
    });
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
