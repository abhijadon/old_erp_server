const { Applications } = require('@/models/Application');
const { LMS } = require('@/models/Lms');
const { HESWelcome } = require('@/emailTemplate/WelcomeMail/HESWelcome');
const { DESWelcome } = require('@/emailTemplate/WelcomeMail/DESWelcome');
const axios = require('axios');
const User = require('@/models/User');

async function resendCommunication(req, res) {
    try {
        const applicationId = req.params.id;
        const { resendEmail, resendWhatsApp } = req.query;
        const existingApplication = await Applications.findById(applicationId);

        if (!existingApplication) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        const { email, phone } = existingApplication.contact;
        const { full_name, customfields, education } = existingApplication;
        const { institute_name, university_name } = customfields;

        if (resendEmail === 'true') {
            // Send Welcome Email
            let welcomeMailSent = false;
            try {
                if (institute_name === 'HES') {
                    await HESWelcome(full_name, email, university_name);
                } else if (institute_name === 'DES') {
                    await DESWelcome(full_name, email, university_name);
                }
                welcomeMailSent = true;
                await LMS.updateOne(
                    { applicationId },
                    { $push: { welcomeMailStatus: { status: 'success', createdAt: new Date() } } }
                );
            } catch (welcomeMailError) {
                await LMS.updateOne(
                    { applicationId },
                    { $push: { welcomeMailStatus: { status: 'failed', errorMessage: welcomeMailError.message, createdAt: new Date() } } }
                );
                console.error(`Error sending welcome mail for application ${applicationId}:`, welcomeMailError);
            }

            existingApplication.welcomeMail = welcomeMailSent ? 'Yes' : 'No';
        }

        if (resendWhatsApp === 'true') {
            // Fetch user phone numbers based on institute name condition
            let phoneNumbers = [];
            let targetEmails = institute_name === 'HES' ? ['aashita@erp.sode.co.in'] : ['aashi@erp.sode.co.in'];

            for (const targetEmail of targetEmails) {
                try {
                    const user = await User.findOne({ username: targetEmail }).exec();
                    if (user && user.phone) {
                        phoneNumbers.push(user.phone);
                    } else {
                        console.log(`User with email ${targetEmail} not found or phone number not available.`);
                    }
                } catch (error) {
                    console.error(`Error fetching user for email ${targetEmail}:`, error);
                }
            }

            // Send WhatsApp message
            let gallaboxWebhookUrl = institute_name === 'HES'
                ? 'https://server.gallabox.com/accounts/62e5204adcf80e00048761df/integrations/genericWebhook/6651aecee5e9efbf11651770/webhook'
                : 'https://server.gallabox.com/accounts/61fce6fd9b042a00049ddbc1/integrations/genericWebhook/6651896de5e9efbf1160ab63/webhook';

            try {
                const whatsappPayload = {
                    lead_id: applicationId,
                    full_name,
                    contact: { email, phone },
                    education: { course: education.course },
                    customfields: { institute_name, university_name, tags: "Support Template", source: "Support Template" },
                    userId: { phone: phoneNumbers }
                };

                await axios.post(gallaboxWebhookUrl, whatsappPayload);

                existingApplication.whatsappMessageStatus = 'success';
                await LMS.updateOne(
                    { applicationId },
                    { $push: { whatsappStatuses: { status: 'success', createdAt: new Date() } } }
                );
            } catch (whatsappError) {
                existingApplication.whatsappMessageStatus = 'failed';
                await LMS.updateOne(
                    { applicationId },
                    { $push: { whatsappStatuses: { status: 'failed', errorMessage: whatsappError.message, createdAt: new Date() } } }
                );
                console.error(`Error sending WhatsApp message for application ${applicationId}:`, whatsappError);
            }
        }

        await existingApplication.save(); // Save the updated application

        return res.status(200).json({ success: true, message: 'Successfully resent communication.' });
    } catch (error) {
        console.error("Error resending communication:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = {
    resendCommunication,
};
