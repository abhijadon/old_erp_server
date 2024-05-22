const axios = require('axios');
const moment = require('moment');

const sendDataToExternalAPI = async (data) => {
  console.log('data', data)
  try {
    const requestBody = {
      name: data['full_name'],
      email: data.contact.email,  // Correct property access
      phone: data.contact.phone,  // Correct property access
      course: data.education.course,  // Correct property access
      specialization: data.customfields.enter_specialization,  // Correct property access
      adminID: "SPU",  // Correct property access
      dob: moment(data.customfields.dob).format('DD/MM/YYYY'),  // Correct property access
      password: moment(data.customfields.dob).format('DDMMYYYY'),  // Correct property access
      fathername: data.customfields.father_name,  // Correct property access
      mothername: data.customfields.mother_name,  // Correct property access
      nationality: "Indian",
      status: "9",
      yearsOrSemester: "1st_Semester",
      username: data.lead_id,  
      sex: data.customfields.gender,  // Correct property access
      session_type: data.customfields.session,  // Correct property access
      totalFee: data.customfields.total_course_fee,  // Correct property access
      semesterFee: data.customfields.paid_amount,  // Correct property access
      centreID: data.username
    };

    const response = await axios.post('https://spu.lmsonline.co/api/studentupdate_insert/', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
 console.log("requestBody", requestBody)
    return response.data;
  } catch (error) {
    console.error('Error sending data to external API:', error.message);
    throw error;
  }
};

module.exports = {
  sendDataToExternalAPI,
};
