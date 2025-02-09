const axios = require('axios');

const testRoutes = async () => {
  try {
    console.log('Testing guest login route...');
    const response = await axios.post('http://localhost:5000/api/auth/guest-login');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

testRoutes(); 