const axios = require('axios'); // Importing axios for HTTP requests

const sendDataToExternalAPI = async (data) => {
  try {
    // Create the body object to be sent to the external API
    const requestBody = {
      name: data['full_name'],
      email: data['contact.email'],
      mobile: data['contact.phone'] ?? data['contact.alternate_phone'], // Use nullish coalescing operator to get the first
      course: data['education.course'] ?? '',
      source: 'chandigarh_online',
      ShortName: 'cuo',
    'source': 'SPU LP',
    "university": "SPU",
     "vertical": "Education",
    "owner": "SPU001"                     
    };

    const response = await axios.post('https://digicampus.co.in/api/leads/', requestBody, {
      headers: {
        'Content-Type': 'application/json', // Ensure correct content type
      },
    });

    return response.data; // Return response data if needed
  } catch (error) {
    console.error('Error sending data to external API:', error.message);
    throw error; // Rethrow error to be handled elsewhere
  }
};

module.exports = {
  sendDataToExternalAPI,
};


                         