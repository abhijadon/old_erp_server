const SibApiV3Sdk = require('@getbrevo/brevo');

// Function to send email
const HesMail = async  (studentEmail, institute, dueAmount, fullName, course, fatherName, dob, phone, installmentType, totalCourseFee, totalPaidAmount, paidAmount) => {
    const currentDate = new Date().toLocaleDateString('en-IN');
  const instituteEmail = 'support@distanceeducationschool.com'
  
    try {
        // Create an instance of the TransactionalEmailsApi
        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        // Set your Brevo API key
        let apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey = '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';

        // Create a new SendSmtpEmail object
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 

        // Set the subject of the email
        sendSmtpEmail.subject = `Dear ${fullName}, Your ${course} Course Fee Successfully Submitted (Team ${institute})`;

        // Set the HTML content of the email
        sendSmtpEmail.htmlContent = `
            <html>
          <body style="display: flex; justify-content: center; align-items: center; margin: 0; background-color: white; height: fit-content; padding: 60px;">
     <div style="text-align: center; border: 1px solid black; width: 700px; padding: 20px;">
         <div style="position: relative; margin-bottom: 100px;">
            <img style="width: 200px; float: left;" src="https://distanceeducationschool.com/wp-content/uploads/2022/10/des-colour-logo-300px.png" alt="img">
            <p style="float: right; width: 300px; margin-top: 0px; text-align: justify;">
                 <span style="padding-bottom: 10px;">For any Queries reach us at <a href="tel:01140468080">011 4046 8080</a></span><br>
                 <span>${instituteEmail}</span>
             </p>
         </div>
         <div>
            <p style="font-size: x-large; font-weight: bold; font-family: inherit; color: #1f4a7d; font-size: 32px;">
                 FEE RECEIPT
             </p>
             <div style="background-color: #1f4a7d; height: 50px;">  
                 <h2 style="color: white; padding: 10px;">
                     Student Details
                 </h2>
             </div>
             <div>
                 <table style="width: 100%; border-collapse: collapse; margin-top: 35px; border: 1px solid #efefef;">
                     <tr>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;"><strong>Student Name</strong></td>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${fullName}</td>
                     </tr>
                     <tr>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;"><strong>Course</strong></td>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${course}</td>
                     </tr>
                     <tr>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;"><strong>Father’s Name   </strong></td>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${fatherName}</td>
                     </tr>
                     <tr>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;"><strong>Date of Birth</strong></td>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${dob}</td>
                     </tr>
                     <tr>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;"><strong>Mobile Number</strong></td>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${phone}</td>
                     </tr>
                     <tr>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;"><strong>Email Address</strong></td>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${studentEmail}</td>
                     </tr>
                 </table>
             </div>
 			 <div style="background-color: #1f4a7d; height: 40px; margin-top: 50px;">
                 <h2 style="color: white; padding: 5px;">
                   Fee Details
                 </h2>
             </div>
 		<div>
                 <table style="width: 100%; border-collapse: collapse; margin-top: 35px; border: 1px solid #efefef;">
                     <tr>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;"><strong>Installment</strong></td>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${installmentType}</td>
                     </tr>
                     <tr>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;"><strong>Total course fee</strong></td>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${totalCourseFee}</td>
                     </tr>
 					<tr>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;"><strong>Total paid amount</strong></td>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${totalPaidAmount}</td>
                     </tr>
 					<tr>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;"><strong>Paid amount</strong></td>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${paidAmount}</td>
                     </tr>
                     <tr>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;"><strong>Due amount</strong></td>
                         <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${dueAmount}</td>
                     </tr>
                 </table>
             </div>	
 			<div style="position: relative; margin-top: 80px;"> 				
            <p style="float: left;">
 					Date: ${currentDate}
 				</p>
             <img style="width: 200px; float: right;" src="https://distanceeducationschool.com/email_marketing/DES_paid.png" alt="img">
                    </div>
 				    <div style="padding-top: 100px;">
 					<p style="font-size: 14px; font-weight: 200; text-align: justify;">Distance Education School is an Information, Counseling & Pre- Admission Process Portal for UGC and DEB recognized Universities. Distance Education School is not authorized to provide any document/study on behalf of any university that’s why we don’t have any role to provide mark cards, certificates, or any other document as it will be the sole property of the university.</p>
 				   </div>
			<div style="text-align: center; margin-top: 50px;">    <img src="https://distanceeducationschool.com/email_marketing/DES_stamp.png" alt="img" style="width: 200px;">
     <hr style="border: 1px solid #b6b6b6;">
 </div>
 	<p style="font-size: 13px;">Registered office: Unit No.1, 3rd Floor Vardhman Trade Centre, Nehru Place, New Delhi - 110019</p>
 				</div>
                     </div>
 </body>
       
            </html>`;
    
       // Set the plain text content of the email
        sendSmtpEmail.textContent = `Dear ${fullName}, Your ${course} Course Fee Successfully Submitted (Team ${institute})`;
                // Set the recipient information
        sendSmtpEmail.to = [{"email": studentEmail }];
        sendSmtpEmail.sender = { name: 'Distance Education School', email: instituteEmail };
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
module.exports = HesMail;
