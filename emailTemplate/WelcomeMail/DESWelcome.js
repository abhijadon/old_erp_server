const SibApiV3Sdk = require('@getbrevo/brevo');

// Function to send email
const DESWelcome = async (full_name, email, university_name) => {
  const instituteEmail = 'support@distanceeducationschool.com';
  
  const universityUrlImage = {
    'SHOOLINI': 'https://distanceeducationschool.com/email_marketing/Shoolini-DES-welcome-mail.png',
    'SHARDA': 'https://distanceeducationschool.com/email_marketing/Sharda-DES-welcome-mail.png',
    'MANGALAYATAN ONLINE': 'https://distanceeducationschool.com/email_marketing/Mangalayatan-DES-welcome-mail.png',
    'MANGALAYATAN DISTANCE': 'https://distanceeducationschool.com/email_marketing/Mangalayatan-DES-welcome-mail.png',
    'JAIN': 'https://distanceeducationschool.com/email_marketing/JAIN-DES-welcome-mail.png',
    'LPU': 'https://distanceeducationschool.com/email_marketing/LPU-DES-welcome-mail.png',
    'CU': 'https://distanceeducationschool.com/email_marketing/Chandigarh-DES-welcome-mail.png',
    'AMITY': 'https://distanceeducationschool.com/email_marketing/Amity-DES-welcome-mail.png',
    'MANIPAL': 'https://distanceeducationschool.com/email_marketing/Manipal-DES-welcome-mail.png',
    'SHOBHIT': 'https://distanceeducationschool.com/email_marketing/Shobhit-DES-welcome-mail.png',
    'SMU': 'https://distanceeducationschool.com/email_marketing/SMU-DES-welcome-mail.png',
    'VGU': 'https://distanceeducationschool.com/email_marketing/VGU-DES-welcome-mail.png',
    'UPES': 'https://distanceeducationschool.com/email_marketing/UPES-DES-welcome-mail.png',
    'UU' : 'https://distanceeducationschool.com/email_marketing/UU-DES-welcome-mail.png',
    'VIGNAN': 'https://distanceeducationschool.com/email_marketing/Vignan-DES-welcome-mail.png', 
    'SGVU': 'https://distanceeducationschool.com/email_marketing/SGVU-DES-welcome-mail.png',
    'AMRITA': 'https://distanceeducationschool.com/email_marketing/Amrita-DES-welcome-mail.png',
    'DPU': 'https://distanceeducationschool.com/email_marketing/DPU-DES-welcome-mail.png',
    'SVSU': 'https://distanceeducationschool.com/email_marketing/SVSU-DES-welcome-mail.png',
'BOSSE': 'https://distanceeducationschool.com/email_marketing/Bosse-DES-welcome-mail.png',
'SHOBHIT': 'https://distanceeducationschool.com/email_marketing/Shobhit-DES-welcome-mail.png'
  };

  const selectedImage = universityUrlImage[university_name.toUpperCase()] || '';

  try {
    // Create an instance of the TransactionalEmailsApi
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    // Set your Brevo API key
    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = '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';

    // Create a new SendSmtpEmail object
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Set the subject of the email
    sendSmtpEmail.subject = `We Welcome you to ${university_name} University for your educational journey!`;

    // Set the HTML content of the email
    sendSmtpEmail.htmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Mail</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
    <table role="presentation"
        style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; width: 100%;">
        <tr>
            <td style="text-align: center; padding: 0;">
                <table role="presentation" width="100%" style="border-collapse: collapse;">
                    <tr>
                        <td>
                            <img src="${selectedImage}"
                                alt="Distance Education School" style="width: 100%; height: auto;">
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
                    <a href="https://api.whatsapp.com/send?phone=9625998568">
                        <img src="https://distanceeducationschool.com/email_marketing/aashi_gupta.png"
                            alt="Support Manager" style="width: 100%; max-width: 400px; height: auto; cursor: pointer;">
                    </a>
                </div>
                <p style="font-size: 15px; color: #333333; line-height: 1.5;">
                    She's here to ensure your experience with us is seamless and fulfilling.
                </p>
                <p style="font-size: 15px; color: #333333; line-height: 1.5;">
                    Got a question or need assistance? Feel free to reach out to her via <span
                        style="color: green;">WhatsApp</span> at 9625998568.
                </p>
                <a href="https://api.whatsapp.com/send?phone=9625998568" style="display: inline-block; text-decoration: none; border-radius: 25px;"><img
                    style="width: 150px;"    src="https://distanceeducationschool.com/email_marketing/connect.png" alt="connect now"></a>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; padding: 20px; background-color: #efefef; line-height: 20px; font-stretch: expanded; font-size: 14px; ">
            <p style="padding-left: 30px; padding-right: 30px;"> <a href="https://distanceeducationschool.com/" style="color: #114D8A;">DistanceEducationSchool.com</a>
           stands as India's top free counseling
            portal for distance and online
            education universities</p>
            <a href="https://www.distanceeducationschool.com"
                style="display: inline-block; padding: 7px 15px; background-color: #114D8A; color: #ffffff; text-decoration: none; border-radius: 25px;">
                Visit Website
            </a>    
        <tr>
            <td
                style="text-align: center; padding: 20px; background-color: #333333; color: #ffffff; line-height: 20px; font-stretch: expanded; font-size: 14px;">
                <div>
                    <a href="#"><img src="https://distanceeducationschool.com/email_marketing/facebook_icon.png"
                            alt="Facebook" style="width: 30px; margin: 0 5px;"></a>
                    <a href="#"><img src="https://distanceeducationschool.com/email_marketing/hes_enroll_5.png"
                            alt="Instagram" style="width: 30px; margin: 0 5px;"></a>
                    <a href="#"><img src="https://distanceeducationschool.com/email_marketing/hes_enroll_6.png"
                            alt="LinkedIn" style="width: 30px; margin: 0 5px;"></a>
                    <a href="#"><img src="https://distanceeducationschool.com/email_marketing/hes_enroll_7.png"
                            alt="WhatsApp" style="width: 30px; margin: 0 5px;"></a>
                    <a href="#"><img src="https://distanceeducationschool.com/email_marketing/youtube_icon.png"
                            alt="Youtube" style="width: 30px; margin: 0 5px;"></a>
                </div>
                <p>Registered Office:</p>
                <p>Unit No. 1 3rd Floor Vardhman Trade Center, Nehru Place,New Delhi - 110019</p>
        <p><a href="tel:+917065777755" style="color: #ffffff;">+91- 7065 777 755</a></p>
            </td>
        </tr>
    </table>
</body>

</html>`;

    // Set the plain text content of the email
    sendSmtpEmail.textContent = `We Welcome you to ${university_name} University for your educational journey!`;
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.sender = { name: 'Distance Education School', email: instituteEmail };
    sendSmtpEmail.bcc = [
      { email: "admin@distanceeducationschool.com" },
      { email: "accounts@distanceeducationschool.com" },
      { email: "admissionsode@gmail.com" }
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
module.exports = { DESWelcome };
