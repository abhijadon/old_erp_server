const HesMail = require('@/emailTemplate/HesMail');
const DesMail = require('@/emailTemplate/DesMail');

const create = async (Model, req, res) => {
    try { 
        const userId = req.user._id;
        const {
            full_name: fullName,
            'education.course': course,
            'contact.email': studentEmail,
            'customfields.university_name': university,
            'customfields.session': session,
            'customfields.dob': dob,
            'contact.phone': phone,
            'customfields.installment_type': installmentType,
            'customfields.father_name': fatherName,
            'customfields.institute_name': institute,
            'customfields.total_course_fee': totalCourseFee,
            'customfields.total_paid_amount': totalPaidAmount,
            'customfields.paid_amount': paidAmount,
        } = req.body;
                  
        const {feeDocument, studentDocument} = req.imageUrls;

        const dueAmount = parseFloat(totalCourseFee) - parseFloat(totalPaidAmount);

        // Create a new document in the Applications collection
        const newDocData = {
            ...req.body,
            userId: userId,
            'customfields.due_amount': dueAmount.toString(),
            feeDocument,
            studentDocument
        };

        const newDoc = new Model(newDocData);
        
        const result = await newDoc.save();

        let emailSent = false;

        if (university && institute) {
            if (institute === 'HES' && ['BOSSE', 'SPU', 'SVSU', 'MANGALAYATAN'].includes(university.toUpperCase())) {
                emailSent = await HesMail(studentEmail, institute, dueAmount, fullName, course, fatherName, dob, phone, installmentType, totalCourseFee, totalPaidAmount, paidAmount);
            } else if (institute === 'DES' && ['BOSSE', 'SPU', 'SVSU', 'MANGALAYATAN'].includes(university.toUpperCase())) {
                emailSent = await DesMail(studentEmail, institute, dueAmount, fullName, course, fatherName, dob, phone, installmentType, totalCourseFee, totalPaidAmount, paidAmount);
            } else if (institute === 'HES' && university.toUpperCase() === 'MANGALAYATAN ONLINE' && (session.toUpperCase() === 'JULY 23' || session.toUpperCase() === 'JAN 24')) {
                emailSent = await HesMail(studentEmail, institute, dueAmount, fullName, course, fatherName, dob, phone, installmentType, totalCourseFee, totalPaidAmount, paidAmount);
            } else if (institute === 'DES' && university.toUpperCase() === 'MANGALAYATAN ONLINE' && (session.toUpperCase() === 'JULY 23' || session.toUpperCase() === 'JAN 24')) {
                emailSent = await DesMail(studentEmail, institute, dueAmount, fullName, course, fatherName, dob, phone, installmentType, totalCourseFee, totalPaidAmount, paidAmount);
            }
        } else {
            throw new Error(`Missing university or institute name`);
        }

        if (emailSent) {
            return res.status(200).json({
                success: true,
                result,
                message: `Successfully created the document in Model and sent ${institute} email notification`,
            });
        } else {
               return res.status(200).json({
                success: true,
                result,
                message: `Successfully created the document in Model, but failed to send ${institute} email notification`,
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

module.exports = { create };
