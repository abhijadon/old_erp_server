const axios = require('axios');
const moment = require('moment');
const { LMS } = require('@/models/Lms'); // Import the LMS model
const { Applications } = require('@/models/Application'); // To ensure applicationId exists
const User = require('@/models/User');
const HesMail = require('@/emailTemplate/LMSTemplate'); // Import the HesMail function

const create = async (req, res) => {
    try {
        const creatorUserId = req.user._id; // Get the user ID from the authenticated user who initiates the create action
        const { applicationId } = req.params; // Get the application ID from the route parameter
        let lms = await LMS.findOne({ applicationId }); // Use let instead of const
        // Retrieve application and user details
        const [application, creatorUser] = await Promise.all([
            Applications.findById(applicationId),
            User.findById(creatorUserId).exec()
        ]);

        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        if (!creatorUser) {
            return res.status(404).json({ message: 'Creator user not found.' });
        }

        const user = await User.findById(application.userId).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const data = application.toObject(); // Convert application document to plain object

        if (data.customfields.university_name !== 'SPU') {
            return res.status(400).json({ message: 'LMS can only be created for SPU university.' });
        }

        const requestBody = {
            applicationId, // Include applicationId in the request body
            name: data.full_name,
            email: data.contact.email,
            phone: data.contact.phone,
            course: data.education.course,
            specialization: data.customfields.enter_specialization,
            adminID: "SPU",
            dob: moment(data.customfields.dob).format('DD-MM-YYYY'),
            password: moment(data.customfields.dob).format('DDMMYYYY'),
            fathername: data.customfields.father_name,
            mothername: data.customfields.mother_name,
            nationality: "Indian",
            status: "9",
            yearsOrSemester: "1st_Semester",
            username: data.lead_id,
            sex: data.customfields.gender,
            session_type: data.customfields.session,
            totalCOursefee: data.customfields.total_course_fee,
            paidamounttotal: data.customfields.total_paid_amount,
            centreID: user.fullname,
            previousData: data.previousData,
        };

        console.log('requrestbody', requestBody)
        
        // Check if any field in the requestBody is undefined or empty
        for (const [key, value] of Object.entries(requestBody)) {
            if (!value) {
                return res.status(400).json({ message: `Field ${key} is required and cannot be empty.` });
            }
        }

        let apiStatus = 'failed';
        try {
            const response = await axios.post('https://spu.lmsonline.co/api/studentupdate_insert/', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                apiStatus = lms ? 'updated' : 'created'; // Set apiStatus based on whether LMS was updated or created
            }
        } catch (error) {
            console.error('Error hitting the external API:', error);
        }

        // Create or update the LMS entry
        let message;
        if (lms) {
            // If LMS entry exists, update it
            lms.status = apiStatus;
            lms.data.push({ status: apiStatus, userId: creatorUserId, updatedAt: new Date() }); // Use creator user's userId
            message = apiStatus === 'updated' ? 'LMS updated successfully.' : 'Failed to update LMS.';
        } else {
            // If LMS entry does not exist, create a new one
            lms = new LMS({
                applicationId,
                status: apiStatus,
                data: [{ status: apiStatus, userId: creatorUserId, updatedAt: new Date() }] // Use creator user's userId
            });
            message = apiStatus === 'created' ? 'LMS created successfully.' : 'Failed to create LMS.';
        }
        const statusSaved = await lms.save(); // Save the LMS status

        // Update lmsStatus in Applications model
        const lmsStatus = apiStatus === 'created' || apiStatus === 'updated' ? 'yes' : 'no';
        await Applications.findByIdAndUpdate(applicationId, { 'customfields.lmsStatus': lmsStatus });

        let emailStatus = 'failed';
        let emailErrorMessage = '';
        if ((apiStatus === 'created' || apiStatus === 'updated') && lms.emailStatuses.every(status => status.status !== 'success')) {
            try {
                const emailSent = await HesMail(data.full_name, data.contact.email, data.lead_id, moment(data.customfields.dob).format('DDMMYYYY'));
                if (emailSent) {
                    emailStatus = 'success';
                    message += ' Email sent successfully.';
                }
            } catch (emailError) {
                emailErrorMessage = emailError.message;
                console.error('Error sending LMS template email:', emailError);
            }

            // Save email status to LMS
            lms.emailStatuses.push({
                status: emailStatus,
                errorMessage: emailErrorMessage,
                createdAt: new Date()
            });
            await lms.save();
        } else if (lms.emailStatuses.some(status => status.status === 'success')) {
            message += ' Email already sent successfully.';
        }

        res.status(200).json({ message, lms: statusSaved, status: apiStatus, emailStatus });
    } catch (error) {
        console.error('Error creating or updating LMS:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { create };
