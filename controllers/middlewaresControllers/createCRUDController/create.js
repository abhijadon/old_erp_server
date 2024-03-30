const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const create = async (Model, req, res) => {
  try {
    let studentEmail;
    try {
      const newDoc = new Model({ ...req.body });
      if (req.files) {
        req.files.forEach((file) => {
          const filePath = path.join(
            process.cwd(),
            'public/uploads/studentdocument',
            file.filename
          );
          const fileData = fs.readFileSync(filePath);

          const fieldname = file.fieldname;
          newDoc.customfields[fieldname] = newDoc.customfields[fieldname] || [];
          newDoc.customfields[fieldname].push({
            originalFilename: file.originalname,
            filename: file.filename,
            data: fileData,
          });
        });
      }

      const {
        'contact.email': contactEmail,
        'customfields.send_fee_receipt': sendFeeReceipt,
        'education.course': course,
        'customfields.institute_name': institute,
        'customfields.father_name': fatherName,
        'customfields.dob': dob,
        'contact.phone': phoneNumber,
        'customfields.total_paid_amount': TotalAmount,
        'customfields.paid_amount': paidAmount,
      } = req.body;

      studentEmail = contactEmail || (req.body.contact && req.body.contact.email) || null;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'abhishek@edgetechnosoft.com',
          pass: 'zibs iflm rzwv dmgw',
        },
      });  


       // Calculate due amount based on total course fee and total paid amount
      const totalCourseFee = parseFloat(req.body.customfields.total_course_fee) || 0;
      const totalPaidAmount = parseFloat(req.body.customfields.total_paid_amount) || 0;
      const dueAmount = totalCourseFee - totalPaidAmount;
      newDoc.customfields.due_amount = dueAmount.toString();

      const result = await newDoc.save();
      const receiverEmail = `${studentEmail}`;

      if (institute && sendFeeReceipt && sendFeeReceipt.toLowerCase() === 'yes') {
        const templateFileName = `${institute.toLowerCase()}_template.ejs`;
        const templatePath = path.join(process.cwd(), 'email_templates', templateFileName);

        const ejsTemplate = fs.readFileSync(templatePath, 'utf-8');
        const renderedHtml = ejs.render(ejsTemplate, {
          full_name: req.body.full_name,
          course,
          father_name: fatherName,
          dob,
          Total_Amount: TotalAmount,
          paidAmount,
          mobile_number: phoneNumber,
          email: contactEmail,
        });

        const mailOptions = {
          from: 'jadonabhishek332@gmail.com',
          to: receiverEmail,
          subject: `${institute} - New Document Created`,
          html: renderedHtml,
          attachments: [
            { filename: 'bg2.jpg', path: './email_templates/img/bg2.jpg', cid: 'bgImage' },
            { filename: 'logo-higher.png', path: './email_templates/img/logo-higher.png', cid: 'hesLogo' },
            { filename: 'paid.png', path: './email_templates/img/paid.png', cid: 'hesPaid' },
            { filename: '5.png', path: './email_templates/img/5.png', cid: 'hesImg' },
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
          error,
        });
      } else {
        return res.status(500).json({
          success: false,
          result: null,
          message: error.message,
          error,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error,
    });
  }
};

module.exports = create;
