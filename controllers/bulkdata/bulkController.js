const { Applications } = require('@/models/Application');
const { Payment } = require('@/models/Payment');
const xlsx = require('xlsx');

// Function to validate data format
const validateData = (data) => {
  return data.every((app) => {
    // Check if education.course is in uppercase
    if (
      app.education &&
      app.education.course &&
      app.education.course !== app.education.course.toUpperCase()
    ) {
      return false;
    }

    // Check if specialization is capitalized
    if (
      app.specialization &&
      app.specialization !== app.specialization.replace(/\b\w/g, (l) => l.toUpperCase())
    ) {
      return false;
    }

    // Check if customfields.session is in the correct format (e.g., "Jan 20 - 20")
    const sessionPattern = /^[a-zA-Z]{3}\s\d{2}\s-\s\d{2}$/;
    if (
      app.customfields &&
      app.customfields.session &&
      !sessionPattern.test(app.customfields.session)
    ) {
      return false;
    }

    // Add other validation checks as needed

    return true;
  });
};

exports.uploadData = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    // Validate data format before insertion
    if (!validateData(data)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

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
                lead_id: app.lead_id,
                student_name: app.full_name,
                email: app.contact.email,
                phone: app.contact.phone,
                total_course_fee: app.customfields.total_course_fee,
                total_paid_amount: app.customfields.total_paid_amount,
                paid_amount: app.customfields.paid_amount,
                counselor_email: app.customfields.counselor_email,
                status: app.customfields.status,
                institute_name: app.customfields.institute_name,
                university_name: app.customfields.university_name,
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
