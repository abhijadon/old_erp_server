const nodemailer = require('nodemailer');

const sendEmail = async (receiverEmail, institute, formData, dueAmount) => {
    const currentDate = new Date().toLocaleDateString('en-IN');
    const instituteEmail = institute === 'HES' ? 'support@highereducationschool.com' : 'support@distanceeducationschool.com';
    const instituteName = institute === 'HES' ? 'High Education School' : 'Distance Education School';

    const html = `
<body style="display: flex; justify-content: center; align-items: center; margin: 0; background-color: white; height: fit-content; padding: 60px;">
    <div style="text-align: center; border: 1px solid black; width: 700px; padding: 20px;">
        <div style="position: relative; margin-bottom: 100px;">
            <img style="width: 200px; float: left;" src="https://distanceeducationschool.com/wp-content/uploads/2022/10/des-colour-logo-300px.png" alt="img">
            <p style="float: right; width: 300px; margin-top: 0px">
                <span>For any Queries reach us at <a href="tel:01140468080">011 4046 8080</a></span><br>
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
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">Student Name</td>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${formData.full_name}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">Course</td>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${formData.education.course}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">Father’s Name</td>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${formData.customfields.father_name}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">Date of Birth</td>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${formData.customfields.dob}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">Mobile Number</td>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${formData.contact.phone}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">Email Address</td>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${formData.contact.email}</td>
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
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">Installment</td>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${formData.customfields.installment_type}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">Total course fee</td>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${formData.customfields.total_course_fee}</td>
                    </tr>
					<tr>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">Total paid amount</td>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${formData.customfields.total_paid_amount}</td>
                    </tr>
					<tr>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">Paid amount</td>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">${formData.customfields.paid_amount}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left; padding: 8px; border: 1px solid #efefef;">Due amount</td>
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
			<div style="text-align: center; margin-top: 50px;">
    <img src="https://distanceeducationschool.com/email_marketing/DES_stamp.png" alt="img" style="width: 200px;">
    <hr style="border: 1px solid #b6b6b6;">
</div> 
	<p style="font-size: 13px;">Registered office: Unit No.1, 3rd Floor Vardhman Trade Centre, Nehru Place, New Delhi - 110019</p>
				</div>
    </div>
</body>
  `;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'abhishek@edgetechnosoft.com',
            pass: 'zibs iflm rzwv dmgw',
        },
    });

    let mailOptions = {
        from: instituteEmail,
        to: receiverEmail,
        subject: `Invoice from ${instituteName}`,
        html: html
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${institute}:`, info.messageId);
        return true;
    } catch (error) {
        console.error(`Error sending email to ${institute}:`, error);
        return false;
    }
};

module.exports = sendEmail;
