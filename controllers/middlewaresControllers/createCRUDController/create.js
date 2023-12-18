const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/studentdocument');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage }).single('image'); // Assuming the field name is 'image'

const create = async (ModelHandler, req, res) => {
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
        const newDoc = new ModelHandler(req.body);

        if (file) {
          const imgPath = path.join(
            process.cwd(), // This gets the current working directory
            'public/uploads/studentdocument',
            file.filename
          );
          const imgData = fs.readFileSync(imgPath);

          newDoc.img = {
            data: imgData,
            contentType: 'image/png', // Change the content type according to your image type
          };
        }

        const result = await newDoc.save();

        // Rest of your logic for sending emails...

        return res.status(200).json({
          success: true,
          result,
          message: `Successfully created the document in ModelHandler and ${
            file ? 'sent email notification' : 'did not attach an image'
          }`,
        });
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
    // Error handling code...
  }
};

module.exports = create;
