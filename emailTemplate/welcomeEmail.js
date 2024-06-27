const SibApiV3Sdk = require('@getbrevo/brevo');

// Function to send email
const WelcomeMail = async  (email) => {
    console.log('Welcome', email);
  const instituteEmail = 'mail@lmsonline.co'
  
    try {
        // Create an instance of the TransactionalEmailsApi
        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        // Set your Brevo API key
        let apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey = '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';
                        
        // Create a new SendSmtpEmail object
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 

        // Set the subject of the email
        sendSmtpEmail.subject = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enrollment Success</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
    <table role="presentation"
        style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; width: 100%;">
        <tr>
            <td style="text-align: center; padding: 0;">
                <table role="presentation" width="100%" style="border-collapse: collapse;">
                    <tr>
                        <td>
                            <img src="https://distanceeducationschool.com/email_marketing/hes_enroll_2.png"
                                alt="Higher Education School" style="width: 100%; height: auto;">
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; padding: 50px;">
                <p style="font-size: 15px; color: #333333; line-height: 1.5;">
                    <strong style="color: #ed3b8e;">Hopefully</strong>, the enrollment process has been smooth for you
                    so far. We will be available to assist you through your educational journey, whether it be during
                    live classes, assignments, exams, or any other activity.
                </p>
                <div style="margin: 20px 0;">
                    <a href="https://api.whatsapp.com/send?phone=9289116921">
                        <img src="https://distanceeducationschool.com/email_marketing/hes_enroll_4.png"
                            alt="Support Manager" style="width: 100%; max-width: 400px; height: auto; cursor: pointer;">
                    </a>
                </div>
                <p style="font-size: 15px; color: #333333; line-height: 1.5;">
                    We are happy to help, kindly contact us if you have a question or need assistance.
                </p>
                <p style="font-size: 15px; color: #333333; line-height: 1.5;">
                    <a href="https://www.highereducationschool.com"
                        style="color: #ed3b8e; text-decoration: none;">HigerEducationSchool.com</a> stands as India's
                    top free counseling portal for distance and online education universities.
                </p>
                <a href="https://www.highereducationschool.com"
                    style="display: inline-block; padding: 7px 15px; margin: 20px 0; background-color: #e74c3c; color: #ffffff; text-decoration: none; border-radius: 5px;">
                    Visit Website
                </a>
            </td>
        </tr>
        <tr>
            <td
                style="text-align: center; padding: 20px; background-color: #333333; color: #ffffff; line-height: 20px; font-stretch: expanded; font-size: 14px;">
                <div>
                    <a href="#"><img src="https://distanceeducationschool.com/email_marketing/hes_enroll_8.png"
                            alt="Facebook" style="width: 30px; margin: 0 5px;"></a>
                    <a href="#"><img src="https://distanceeducationschool.com/email_marketing/hes_enroll_5.png"
                            alt="Instagram" style="width: 30px; margin: 0 5px;"></a>
                    <a href="#"><img src="https://distanceeducationschool.com/email_marketing/hes_enroll_6.png"
                            alt="LinkedIn" style="width: 30px; margin: 0 5px;"></a>
                    <a href="#"><img src="https://distanceeducationschool.com/email_marketing/hes_enroll_7.png"
                            alt="WhatsApp" style="width: 30px; margin: 0 5px;"></a>
                </div>
                <p>Registered Office:</p>
                <p>Office Number 25, Gayatri Satsang, Behind Vishnu Shivam Mall, Near Bank of Baroda Thakur Village,
                    Kandivali East Mumbai - 400101</p>
            </td>
        </tr>
    </table>
</body>

</html>`;
    
       // Set the plain text content of the email
        sendSmtpEmail.textContent = `Welcome to Sikkim Professional University LMS`;
                // Set the recipient information
        sendSmtpEmail.to = [{"email": email }];
        sendSmtpEmail.sender = { name: 'Sikkim Professional University', email: instituteEmail };
        sendSmtpEmail.bcc = [
    {"email": "admin@distanceeducationschool.com"},
    {"email": "accounts@distanceeducationschool.com"},
    {"email": "admissionsode@gmail.com"}
];
        // Call the sendTransacEmail method to send the email
      await apiInstance.sendTransacEmail(sendSmtpEmail);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

// Import the sendEmail function wherever you want to use it in your codebase
module.exports = {WelcomeMail};
 