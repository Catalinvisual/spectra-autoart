import axios from 'axios';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTAxODkxOSwiZXhwIjoxNzY1MTA1MzE5fQ.mlMBn-lObtKoPdm2O_Xm_NizB95OtnMax7SExQzTHlU';

async function testCreateService() {
  try {
    console.log('🧪 Testing service creation with prices...');
    
    const response = await axios.post('http://localhost:8080/api/vehicle-services', {
      name: 'Test Service Debug',
      description: 'Testing price mapping',
      default_prices: {
        sedan: 150,
        suv: 200,
        hatchback: 180
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Service created:', response.data);
  } catch (error) {
    console.error('❌ Error details:');
    console.error('Message:', error.message);
    console.error('Response:', error.response?.data);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
    console.error('Full error:', error);
  }
}

testCreateService();