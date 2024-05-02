const SibApiV3Sdk = require('@getbrevo/brevo');

// Function to send email
const HesMail = async (studentEmail, institute, dueAmount, fullName, course, fatherName, dob, phone, installmentType, totalCourseFee, totalPaidAmount, paidAmount)  => {
    const currentDate = new Date().toLocaleDateString('en-IN');
  const instituteEmail = 'support@highereducationschool.com'
  
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
        sendSmtpEmail.htmlContent = `
           <!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" href="hes-fees-receipt.css">
	<script src="https://kit.fontawesome.com/2e53935cd9.js" crossorigin="anonymous"></script>
	<title>Students Fee Receipt</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight&display=swap');

@media only screen and (max-width: 635px) {
	.c2 {
		font-size: 12px;
	}
}

@media only screen and (max-width: 480px) {
	.c1 {
		width: 100%!important;
		text-align: center!important;
	}

	#a2 {
		padding: 20px 0px 0px 0px!important;
	}

	#aaa {
		height: 210px!important;
	    background-image: none!important;
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

    #a11 {
    	padding: 0!important;
    }
}

body {
	margin: 0;
	font-family: 'Inter Tight', sans-serif;
    background-color: #eee;
}

#a1 {
	max-width: 400px;
    position: absolute;
    left: 0;
}

#a2 {
	max-width: 250px;
    width: 65%;
    padding: 50px 0px 0px 50px;
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
	height: 160px;
	background-image: url(https://highereducationschool.com/wp-content/uploads/2022/09/1.png);
    background-repeat: no-repeat;
    background-size: 400px;
    background-position: top left;
}

.c2 {
    margin-top: 50px;
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
	margin: 0;
	text-transform: uppercase;
    font-size: 20px;
    letter-spacing: 2px;
    text-align: center;
}

.c3 {
	padding: 10px;
	background-color: #002060;
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
    position: absolute;
    right: 0;
    left: 0;
    margin: auto;
    background-color: #fff;
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
    padding: 5px 10px 5px 10px;
    border: solid 1px;
    width: 50%;
}

#a5 {
    border: solid 1px;
    margin-top: -1px;
    padding: 10px;
}

#a5 div {
	display: inline-block;
    width: 32%;
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
	font-size: 14px;
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
	background-image: url(https://highereducationschool.com/wp-content/uploads/2022/09/2.png);
    background-repeat: no-repeat;
    background-size: 400px;
    padding: 0px 40px 50px 40px;
    background-position: bottom right;
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
    </style>
</head>
<body>
<div class="c5">
	<div id="aaa">
	<div class="c1">
		<img id="a2" src="https://highereducationschool.com/wp-content/uploads/2022/09/3.png">
	</div>	
	<div id="a16">
	<div class="c2">
		<div id="a17">
		<i class="fa-solid fa-phone"></i><a href="tel:02241946500">022 - 419 46 500</a><br>
		<i class="fa-solid fa-globe"></i><a href="https://highereducationschool.com">www.highereducationschool.com</a><br>
		<i class="fa-regular fa-envelope"></i><a href="mailto:support@highereducationschool.com">${instituteEmail}</a>
		</div>
	</div>
	</div>
</div>


<h1 id="a4">Fee Receipt</h1>
<br>

<div id="a14">
	<div class="c3">
		<h2 class="c4">student details</h2>
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
	<br><br>

	<div class="c3">
		<h2 class="c4">fee details</h2>
	</div>

	<table class="c6">
		<tbody>
        <tr>
			<td><b>Instllment</b></td>
			<td>${installmentType}</td>
		</tr>
        <tr>
			<td><b>Total Course Fee</b></td>
			<td>${totalCourseFee}</td>
		</tr>
		<tr>
			<td><b>Total Paid Amount</b></td>
			<td>${totalPaidAmount}</td>
		</tr>
        <tr>
			<td><b>Paid Amount</b></td>
			<td>${paidAmount}</td>
		</tr>
		<tr>
			<td><b>Due Amount</b></td>
			<td>${dueAmount}</td>
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
		<div id="a8">
			<img src="https://highereducationschool.com/wp-content/uploads/2022/09/5.png">
		</div>
	</div>
</div>
	<br>
	<div id="a15">
	<p id="a9">We at Higher Education School do not take any credits while sharing any documents including certificates and mark sheets under the name of any UGC-DEB university. On our education portal, you get counseling to fill the gap between you & UGC-DEB universities. And you get guidance on the admission process, examination, fees, and submissions of assignments. For any query, please contact us.</p>

	<div id="a13">
	<hr id="a10" />
	<b><p id="a11">Office Number - 25, Gayatri Satsang, Behind Vishnu Shivam Mall, Near Bank of Baroda Thakur Village, Kandivali East Mumbai - 400101</p></b>
	</div>
	</div>

	<div id="a18">
	<button onclick="window.print()">Print Receipt</button>
	</div>
</div>
</body>
</html>`;

       // Set the plain text content of the email
        sendSmtpEmail.textContent = `Dear ${fullName}, Your ${course} Course Fee Successfully Submitted (Team ${institute})`;
sendSmtpEmail.sender = { name: 'Higher Education School', email: instituteEmail };
        // Set the recipient information
        sendSmtpEmail.to = [{"email": studentEmail }];
        sendSmtpEmail.bcc = [{email: 'mail@highereducationschool.com'}];
        // Call the sendTransacEmail method to send the email
            // Call the sendTransacEmail method to send the email
      await apiInstance.sendTransacEmail(sendSmtpEmail);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

// Import the sendEmail function wherever you want to use it in your codebase
module.exports = HesMail;
