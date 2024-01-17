// controllers/dataController.js
const { Applications } = require('@/models/appModels/Application');
const { Payment } = require('@/models/appModels/Payment'); // Update the path based on your project structure
const xlsx = require('xlsx');

exports.uploadData = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    const applicationResult = await Applications.insertMany(data);

    // Check if it's a bulk upload
    const isBulkUpload = data.length > 1;

    // If it's a bulk upload, update the Payment table
    if (isBulkUpload) {
      const applicationIds = applicationResult.map((app) => app._id);

      await Promise.all(
        applicationResult.map((app) =>
          Payment.updateOne(
            { applicationId: app._id },
            {
              $set: {
                student_name: app.full_name,
                email: app.contact.email,
                phone: app.contact.phone,
                total_course_fee: app.customfields.total_course_fee,
                total_paid_amount: app.customfields.total_paid_amount,
                paid_amount: app.customfields.paid_amount,
                counselor_email: app.customfields.counselor_email,
                status: app.customfields.status,
                // Add other fields as needed
              },
            },
            { upsert: true }
          )
        )
      );
    }

    res.status(200).json({ message: 'Data uploaded successfully', applicationResult });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
