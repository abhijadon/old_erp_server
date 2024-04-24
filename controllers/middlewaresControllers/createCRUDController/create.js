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
            'customfields.payment_type': payment_type,
            'customfields.payment_mode': payment_mode,
            'customfields.father_name': fatherName,
            'customfields.institute_name': institute,
            'customfields.total_course_fee': totalCourseFee,
            'customfields.total_paid_amount': totalPaidAmount,
            'customfields.paid_amount': paidAmount,
        } = req.body;

        const { feeDocument, studentDocument } = req.imageUrls;

        const parsedTotalPaidAmount = parseFloat(totalPaidAmount) || 0;
        const parsedPaidAmount = parseFloat(paidAmount) || 0;

        const updatedTotalPaidAmount = parsedTotalPaidAmount + parsedPaidAmount;

        const dueAmount = parseFloat(totalCourseFee) - updatedTotalPaidAmount;

        const newDocData = {
            userId,
            ...req.body,
            'customfields.due_amount': dueAmount.toString(),
            'customfields.total_paid_amount': updatedTotalPaidAmount.toString(),
            'customfields.installment_type': '1st Installment',
            'customfields.status': 'New',
            'customfields.paymentStatus': 'payment received',
            feeDocument,
            studentDocument,
        };

        // Initialize `previousData` with the first entry
        const initialPreviousData = {
            installment_type: '1st Installment', // Initial Installment
            paymentStatus: 'payment received',
            payment_type,
            payment_mode,
            total_course_fee: totalCourseFee,
            total_paid_amount: updatedTotalPaidAmount,
            paid_amount: parsedPaidAmount,
            due_amount: dueAmount.toString(),
            date: new Date(), // Log current date/time
        };

        newDocData.previousData = [initialPreviousData]; // Add initial data to `previousData`

        const newDoc = new Model(newDocData);
        
        const result = await newDoc.save();
        let emailSent = false;

        if (university && institute) {
            if (institute === 'HES' && ['BOSSE', 'SPU', 'SVSU', 'MANGALAYATAN'].includes(university.toUpperCase())) {
                emailSent = await HesMail(studentEmail, institute, dueAmount, fullName, course, fatherName, dob, phone, installmentType, totalCourseFee, updatedTotalPaidAmount, paidAmount, payment_type);
            } else if (institute === 'DES' && ['BOSSE', 'SPU', 'SVSU', 'MANGALAYATAN'].includes(university.toUpperCase())) {
                emailSent = await DesMail(studentEmail, institute, dueAmount, fullName, course, fatherName, dob, phone, installmentType, totalCourseFee, updatedTotalPaidAmount, paidAmount, payment_type);
            } else if (institute === 'HES' && university.toUpperCase() === 'MANGALAYATAN ONLINE' && (session.toUpperCase() === 'JULY 23' || session.toUpperCase() === 'JAN 24')) {
                emailSent = await HesMail(studentEmail, institute, dueAmount, fullName, course, fatherName, dob, phone, installmentType, totalCourseFee, updatedTotalPaidAmount, paidAmount, payment_type);
            } else if (institute === 'DES' && university.toUpperCase() === 'MANGALAYATAN ONLINE' && (session.toUpperCase() === 'JULY 23' || session.toUpperCase() === 'JAN 24')) {
                emailSent = await DesMail(studentEmail, institute, dueAmount, fullName, course, fatherName, dob, phone, installmentType, totalCourseFee, updatedTotalPaidAmount, paidAmount, payment_type);
            }
        } else {
            throw new Error(`Missing university or institute name`);
        }

        if (emailSent) {
            return res.status(200).json({
                success: true,
                result,
                message: `Successfully data added and send successfully ${institute} & ${university} email notification`,
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
