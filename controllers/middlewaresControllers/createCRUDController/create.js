const sendEmail = require('@/emailTemplate/emailSender');

const create = async (Model, req, res) => {
    try {
           // Extract userId from req.user
        const userId = req.user._id;
        let studentEmail = (req.body.contact && req.body.contact.email) || null;
        const institute = req.body.customfields.institute_name;
        const totalCourseFee = parseFloat(req.body.customfields.total_course_fee) || 0;
        const totalPaidAmount = parseFloat(req.body.customfields.total_paid_amount) || 0;
        const dueAmount = totalCourseFee - totalPaidAmount;

        const newDoc = new Model({ ...req.body, userId, 'customfields.due_amount': dueAmount.toString() });
        const result = await newDoc.save();

        if (institute && req.body.customfields.send_fee_receipt && req.body.customfields.send_fee_receipt.toLowerCase() === 'yes') {
            const emailSent = await sendEmail(studentEmail, institute, req.body, dueAmount); // Pass dueAmount here

            if (emailSent) {
                return res.status(200).json({
                    success: true,
                    result,
                    message: `Successfully created the document in Model and sent ${institute} email notification`,
                });
            } else {
                throw new Error(`Failed to send email to ${studentEmail}`);
            }
        } else {
            return res.status(200).json({
                success: true,
                result,
                message: `Document created in Model, but ${institute} email not sent`,
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
};

module.exports = create;
