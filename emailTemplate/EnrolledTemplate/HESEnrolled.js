const SibApiV3Sdk = require('@getbrevo/brevo');

// Function to send email
const HESEnrolled = async ({ full_name, email, enrollment, password, URL }) => {
  console.log('Sending email to:', email);
  const instituteEmail = 'support@highereducationschool.com';
  try {
    // Create an instance of the TransactionalEmailsApi
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    // Set your Brevo API key
    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = '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';

    // Create a new SendSmtpEmail object
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Set the subject of the email
    sendSmtpEmail.subject = `Your Enrollment Number has been Generated`;

    // Set the HTML content of the email
    sendSmtpEmail.htmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enrollment Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            background-color: #F5F5F5;
            border: 1px solid #e0e0e0;
        }

        .header {
            background-color: #0073e6;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }

        .header img {
            max-width: 100px;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 45px;
        }

        .content h2 {
            color: #333333;
            font-size: 18px;
        }

           .content h2 span {
            color: black;
            font-size: 22px;
        }

        .content p {
            font-size: 16px;
            color: #333333;
        }

        .content table {
            width: 50%;
            margin-top: 10px;
            border-collapse: collapse;
        }

          .content table th {
           color: #0073e6;
        }


        .content table th,
        .content table td {
            border: 2px solid #333333;
            padding: 10px;
            text-align: left;
            border-radius: 100px;
        }

        .content a {
            color: #0073e6;
            text-decoration: none;
        }

        .footer {
            padding: 10px;
            text-align: center;
            background-color: #f5f5f5;
            color: #333333;
            font-size: 12px;
        }

         .hr {
            color: red !important;
        }

        .responsive-img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>

<body>
    <div class="container">
        <div>
            <img src="https://distanceeducationschool.com/email_marketing/hes_enroll_1.webp" alt="Higher Education School"
                class="responsive-img">
        </div>
        <div class="content">
            <h2>Hello <span>${full_name}</span></h2>
            <p>Enrollment / registration number has been generated:</p>
            <table>
                <tr>
                    <th>Registration No.</th>
                    <td>${enrollment}</td>
                </tr>
                <tr>
                    <th>Password</th>
                    <td>${password}</td>
                </tr>
            </table>
            <p><a href="${URL}">${URL}</a></p>
            <p>Also kindly revert if any correction is required in your profile.</p>
            <p><strong>Note:</strong> Kindly review your personal information and revert if any corrections are
                required. (Student name, Father name, DOB, GENDER, COURSE etc.)</p>
        </div>
        <div class="footer">
            <hr style="border: none; border-top: 1.5px solid #c3c3c3;">
            <p>&copy; 2024 Higher Education School. All rights reserved.</p>
        </div>
    </div>
</body>

</html>`;

    // Set the plain text content of the email
    sendSmtpEmail.textContent = `Your Enrollment Number has been Generated`;
    sendSmtpEmail.sender = { name: 'Higher Education School', email: instituteEmail };
    // Set the recipient information
    sendSmtpEmail.to = [{ "email": email }];
    sendSmtpEmail.bcc = [{ "email": "abhishek@edgetechnosoft.com" }, { "email": "aashi@distanceeducationschool.com" }, { email: 'mail@highereducationschool.com' }];
    // Call the sendTransacEmail method to send the email
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Export the sendEmail function
module.exports = HESEnrolled;
