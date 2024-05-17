const axios = require('axios');
const moment = require('moment');

const sendDataToExternalAPI = async (data) => {
  try {
    const requestBody = {
  name: data['full_name'],
  email: data['contact.email'],
  phone: data['contact.phone'],
  course: data['education.course'],
  specialization: data['customfields.enter_specialization'],
  adminID: data['customfields.university_name'],
  dob: moment(data['customfields.dob']).format('DD/MM/YYYY'),
  password: moment(data['customfields.dob']).format('DDMMYYYY'),
  fathername: data['customfields.father_name'],
  mothername: data['customfields.mother_name'],
  nationality: "Indian",
  status: "9",
  yearsOrSemester: "1st_Semester",
  username: data['lead_id'],  
  sex: data['customfields.gender'],
  session_type: data['customfields.session'], 
  totalFee: data['customfields.total_course_fee'],
  semesterFee: data['customfields.paid_amount'],
  centreID: "2"
}
    const response = await axios.post('https://spu.lmsonline.co/api/studentupdate_insert/', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },

    });

    console.log('requestBody', requestBody)

    return response.data;
  } catch (error) {
    console.error('Error sending data to external API:', error.message);
    throw error;
  }
};

module.exports = {
  sendDataToExternalAPI,
};
