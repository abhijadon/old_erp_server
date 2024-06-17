const SibApiV3Sdk = require('@getbrevo/brevo');

// Function to send email
const WelcomeMail = async  (fullName, email, username, password) => {
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
        sendSmtpEmail.subject = `Welcome to Sikkim Professional University LMS`;

        // Set the HTML content of the email
        sendSmtpEmail.htmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Students Fee Receipt</title>
    <style>
        body {
            margin: 0;
            font-family: 'Inter Tight', sans-serif;
            background-color: white;
            padding: 10px !important;
        }

        #center {
            text-align: center !important;
        }

        #spu {
            background-color: #0599c4 !important;
            border: 1px solid #ebf4f6 !important;
            border-color: #ebf4f6 !important;
            border-radius: 6px !important;
            border-width: 1px !important;
            color: #ffffff !important;
            display: inline-block !important;
            font-size: 14px !important;
            font-weight: normal !important;
            letter-spacing: 0px !important;
            line-height: normal !important;
            padding: 10px 20px 10px 20px !important;
            text-align: center !important;
            text-decoration: none !important;
            border-style: solid !important;
        }

        #abhi {
            border-bottom: 3.5px solid rgb(5, 153, 196);
            width: 90%;
            text-align: center;
            margin: 10px auto;
        }

      table {
        margin-left: 35px !important;
      }

        td {
            padding: 5px 0px;
            font-style: normal;
            font-size: 14px;
            line-height: 24px;
        }

        #a9 {
            text-align: center;
            font-size: 12px;
            letter-spacing: 0.5px;
        }
    </style>
</head>

<body>
    <div style="max-width: 700px; margin: auto; background-color: white;">
        <div style="width: 100%; height: 100px; text-align: center;">
            <div style="width: 70%; margin: auto;">
                <img id="a2" src="https://distanceeducationschool.com/email_marketing/spu_logo.png" alt="SPU Logo" style="max-width: 200px; margin-top: 60px; height: 65px">
            </div>
        </div>
        <br>
        <div id="abhi"></div>
        <div style="padding: 0px !important; line-height: 40px !important; margin-top: 15px; font-size: 11px !important; font-weight: normal;">
            <table>
                <tbody>
                    <tr>
                        <td>Welcome mail this </strong></td>
                    </tr>
                    <tr>
                        <td>Log in to your dashboard to access your information & details.</td>
                    </tr>
                    <tr>
                        <td>We wish you a very Happy Learning!</td>
                    </tr>
                </tbody>
            </table>
            <div id="center">
                <a id="spu" href="https://spu.lmsonline.co" style="background-color: #0599c4 !important; border: 1px solid #ebf4f6 !important; border-color: #ebf4f6 !important; border-radius: 6px !important; border-width: 1px !important; color: #ffffff !important; display: inline-block !important; font-size: 14px !important; font-weight: normal !important; letter-spacing: 0px !important; line-height: normal !important; padding: 10px 20px 10px 20px !important; text-align: center !important; text-decoration: none !important; border-style: solid !important;">Sign In</a>
            </div>
            <div id="abhi"></div>
        </div>
        <div id="bhi">
            <p id="a9">You received this email because your email-id signed up for a new account.</p>
        </div>
    </div>
</body>

</html>`;
    
       // Set the plain text content of the email
        sendSmtpEmail.textContent = `Welcome to Sikkim Professional University LMS`;
                // Set the recipient information
        sendSmtpEmail.to = [{"email": email }];
        sendSmtpEmail.sender = { name: 'Sikkim Professional University', email: instituteEmail };
        sendSmtpEmail.bcc = [
    {"email": "abhishek@edgetechnosoft.com"},
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
