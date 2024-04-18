const create = async (Model, req, res) => {
    try { 
        const userId = req.user._id;
        const {
            'customfields.institute_name': institute,
            'customfields.total_course_fee': totalCourseFee,
            'customfields.total_paid_amount': totalPaidAmount,
        } = req.body;
                  
        const { feeDocument, studentDocument } = req.imageUrls;

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

        return res.status(200).json({
            success: true,
            result,
            message: `Successfully created the document in Model, but failed to send ${institute} email notification`,
        });
        
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
