const SibApiV3Sdk = require('@getbrevo/brevo');

// Function to send email
const DesMail = async (studentEmail, institute, dueAmount, fullName, course, fatherName, dob, phone, installmentType, payment_type, totalCourseFee, totalPaidAmount, paidAmount) => {

    const currentDate = new Date().toLocaleDateString('en-IN');
  const instituteEmail = 'support@distanceeducationschool.com'
  
    try {
        // Create an instance of the TransactionalEmailsApi
        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        // Set your Brevo API key
        let apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey = '';

        // Create a new SendSmtpEmail object
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 

        // Set the subject of the email
        sendSmtpEmail.subject = `Dear ${fullName}, Your ${course} Course Fee Successfully Submitted`;

        // Set the HTML content of the email
        sendSmtpEmail.htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Students Fee Receipt</title>
    <link rel="stylesheet" type="text/css" href="hes-fees-receipt.css">
    <script src="https://kit.fontawesome.com/2e53935cd9.js" crossorigin="anonymous"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight&display=swap');

        /* Media queries */
        @media only screen and (max-width: 635px) {
            .c2 {
                font-size: 12px;
            }
        } 
		body{
			padding: 10px !important;
		}

        @media only screen and (max-width: 480px) {
            .c1 {
                width: 100%!important;
                text-align: center!important;
            }
               
.c5 {
              background-size: 350px !important;
            }

			#a4{
				margin-top: 30px !important;
			}
 

.rel h4 span {
   margin-right: 0px !important;
}
  
td {
    padding: 2px !important;
	line-height: 24px !important;
	margin-left: 10px !important;
}

	.c3 h4 span{
		margin-right: 0px !important;
	}
#a9{
	padding: 10px !important;
}
            #a2 {
                padding: 20px 0px 0px 0px!important;
			   max-width: 200px;
    margin-top: 0px !important;
    margin-left: 0px !important;
            }

            .c2 {
                width: 100%!important;
                margin-top: 0!important;
                text-align: left!important;
                font-size: 16px!important;
                float: none!important;
            }

            #a14 {
                padding: 0px!important;
            }

            #a15 {
                padding: 0px 0px 10px 0px!important;
            }

            #a17 {
                margin-top: 15px !important;
                text-align: center;
            }

            #a8 img, #a7 img {
                width: 90%;
            }

            #a6 {
                font-size: 14px;
            }

        }

        body {
            margin: 0;
            font-family: 'Inter Tight', sans-serif;
            background-color: white;
            height: 100vh;
			padding: 10px !important;
        }

        #a1 {
            max-width: 400px;
            position: absolute;
            left: 0;
        }

        #a2 {
            max-width: 200px;
            margin-top: 50px;
            margin-left: 80px;
        }

        .c1, .c2 {
            display: inline-block;
            float: left;
        }

        .c1 {
            width: 55%;
            text-align: left;
        }

        .c2 {
            width: 45%;
            float: right;
        }

        #aaa {
            width: 100%;
            height: 100px;
        }

        .c2 {
            margin-top: 60px;
            text-align: left;
        }

        .c2 i {
            margin: 5px;
        }

        .c2 a {
            text-decoration: none;
        }

        #a4 {
            color: #002060;
            height: 20px;
            text-transform: capitalize;
            font-size: 20px;
            letter-spacing: 2px;
            text-align: center;
        }

        .c4 {
            color: #fff;
            text-transform: capitalize;
            font-size: 16px;
            letter-spacing: 1px;
            margin: 0;
        }

        .c5 {
            max-width: 750px;
            text-align: center;
            margin: auto;
            background-color: white;
            background-image: url(https://distanceeducationschool.com/email_marketing/SODE_watermark.png);
            background-repeat: no-repeat;
            background-size: 400px;
            background-position: center;
		    border: 1px solid #d7d5d5;
        }

        .c6 {
            width: 100%;
            text-align: left;
            border-collapse: collapse;
        }

        ctbody {
            margin: 10px 30px;
        }

        td {
            padding: 5px 60px;
			margin-top: 20px;
            border-bottom: 1px solid #c4c2c2;
            width: 50%;
			text-align: justify;
			text-align: justify;
			font-style: normal;
			font-size: 14px;
        } 
		td .fee {
			color: #FF0066 !important;
			font-weight: 600;
		}

        #a5 {
          padding: 20px;
		  margin-top: 20px;
        }

        #a5 div {
            display: inline-block;
            width: 48%;
            vertical-align: middle;
        }

        #a7 img {
            max-width: 120px;
        }

        #a7 {
            text-align: right;
        }

        #a8 img {
            max-width: 100px;
        }

        #a6 {
            text-align: left;
        }

        #a9 {
            text-align: justify;
            font-size: 14px;
            letter-spacing: 0.5px;
        }

        #a10 {
            margin-top: 80px;
        }

        #a11 {
            font-size: 12px;
            letter-spacing: 1px;
            color: #002060;
            line-height: 1.4em;
            padding: 0px 20px;
        }

        #a12 {
            max-width: 400px;
            right: 0;
            position: absolute;
            margin-top: -100px;
        }

        #a15 {
            padding: 0px 40px 50px 40px;
        }

        #a14 {
            padding: 0 80px;
        }

        #a18 {
            padding: 10px 20px;
            background-color: #eee;
            display: none;
        }

        #a18 button {
            border: none;
            text-transform: uppercase;
            background-color: #002060;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            font-family: 'Inter Tight';
            letter-spacing: 2px;
        } 
		

        .rel h4 {
			background-image: url(https://distanceeducationschool.com/email_marketing/SODE_fee_receipt_line_up.png);
			background-repeat: no-repeat;
	        background-size: 700px;
			padding: 5px;
        } 
		.rel h4 span {
		    color: #fff;
			text-transform: uppercase;
			text-align: left;
			max-width: 10px;
			font-size: 13px;
			margin-right: 300px;
			letter-spacing: 1px;
        }

		 .c3 h4 {
			background-image: url(https://distanceeducationschool.com/email_marketing/SODE_fee_receipt_line_up.png);
			background-repeat: no-repeat;
	        background-size: 700px;
			padding: 5px;
        } 
		.c3 h4 span {
		    color: #fff;
			text-transform: uppercase;
			text-align: left;
			max-width: 10px;
			font-size: 13px;
			margin-right: 350px;
			letter-spacing: 1px;
        }
    </style>
</head>
<body>
<div class="c5">
    <div id="aaa">
        <div class="c1">
            <img id="a2" src="https://distanceeducationschool.com/wp-content/uploads/2022/10/des-colour-logo-300px.png">
        </div>
        <div id="a16">
            <div class="c2">
                <div id="a17">
                    <img width="15" style="margin-right: 10px;" src="https://distanceeducationschool.com/email_marketing/phone_icon.png" alt=""><a href="tel:01140468080">01140468080</a><br>
                    <img width="15" style="margin-right: 10px;" src="https://distanceeducationschool.com/email_marketing/mail_icon.png" alt=""><a href="mailto:support@distanceeducationschool.com">${instituteEmail}</a>
                </div>
            </div>
        </div>
    </div>
    <br>
    <h1 id="a4">Fees Receipt</h1>
    <div id="a14">
        <div class="rel">
            <h4>
				<span>Students Details</span>
			</h4>
            </div>

        <table class="c6">
            <tbody>
            <tr>
                <td><b>Name of the Student</b></td>
                <td>${fullName}</td>
            </tr>
            <tr>
                <td><b>Course</b></td>
                <td>${course}</td>
            </tr>
            <tr>
                <td><b>Father’s Name</b></td>
                <td>${fatherName}</td>
            </tr>
            <tr>
                <td><b>Date of Birth</b></td>
                <td>${dob}</td>
            </tr>
            <tr>
                <td><b>Mobile Number</b></td>
                <td>${phone}</td>
            </tr>
            <tr>
                <td><b>Email Address</b></td>
                <td>${studentEmail}</td>
            </tr>
            </tbody>
        </table>
        <br>

        <div class="c3">
            <h4><span>
				fee details
			</span></h4>
        </div>

        <table class="c6">
            <tbody>
            <tr>
                <td><b>Installment</b></td>
                <td>${installmentType}</td>
            </tr>
            <tr>
                <td><b>${payment_type} amount</b></td>
                <td><span class="fee">${totalCourseFee}</span> <span>INR</span></td>
            </tr>
            <tr>
                <td><b>Total Paid Amount</b></td>
                <td><span class="fee">${totalPaidAmount}</span> <span>INR</span></td>
            </tr>
            <tr>
                <td><b>Paid Amount</b></td>
                <td><span class="fee">${paidAmount}</span> <span>INR</span></td>
            </tr>
            <tr>
                <td><b>Due Amount</b></td>
                <td><span class="fee">${dueAmount}</span> <span>INR</span></td>
            </tr>

            </tbody>
        </table>

        <div id="a5">
            <div id="a6">
                <b>Date:</b> ${currentDate}
            </div>
            <div id="a7">
                <img src="https://highereducationschool.com/wp-content/uploads/2022/09/4.png">
            </div>
        </div>
    </div>
    <br>
    <div id="a15">
        <p id="a9">Distance Education School is an Information, Counseling & Pre- Admission Process Portal for UGC and DEB recognized Universities. Distance Education School is not authorized to provide any document/study on behalf of any university that’s why we don’t have any role to provide mark cards, certificates, or any other document as it will be the sole property of the university.</p>
			<div style="text-align: center;">    <img src="https://distanceeducationschool.com/email_marketing/DES_stamp.png" alt="img" style="width: 200px;">
     <hr style="border: 1px solid #b6b6b6;">
 </div>
      <b><p id="a11"><strong>Registered office</strong>: <span>Unit No.1, 3rd Floor Vardhman Trade Centre, Nehru Place, New Delhi - 110019</span></p></b>
    </div>
	<img width="750" src="https://distanceeducationschool.com/email_marketing/SODE_fee_receipt_line_bottom.png" alt="">
</div>
</body>
</html>
`;
    
       // Set the plain text content of the email
        sendSmtpEmail.textContent = `Dear ${fullName}, Your ${course} Course Fee Successfully Submitted (Team ${institute})`;
                // Set the recipient information
        sendSmtpEmail.to = [{"email": studentEmail }];
        sendSmtpEmail.sender = { name: 'Distance Education School', email: instituteEmail };
        sendSmtpEmail.bcc = [
    {"email": "abhishek@edgetechnosoft.com"},
    {"email": "aashi@distanceeducationschool.com"},
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
module.exports = DesMail;
