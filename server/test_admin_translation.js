import axios from 'axios';

async function testAdminTranslation() {
  console.log('🧪 Testing admin translation endpoint...');
  
  const testData = {
    name: 'Test Admin Translation Service',
    description: 'This is a test service created through admin panel with translation',
    category: 'test-category',
    duration_minutes: 90,
    is_active: true
  };

  try {
    const response = await axios.post('http://localhost:8080/api/admin/services/create-with-translation', testData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTAyNzk4OSwiZXhwIjoxNzY1MTE0Mzg5fQ.dwtebhIMCFx9hKx0aWJzan1e3ahrJ7dF_6jHtv1bVdM'
      }
    });

    console.log('📊 Response status:', response.status);
    console.log('📋 Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('✅ Success: Service created with translation and prices!');
      console.log('🆔 Service ID:', response.data.data.serviceId);
      console.log('🌍 Translations saved for languages:', Object.keys(response.data.data.translations));
      console.log('💰 Prices saved:', response.data.data.pricesSaved);
    } else {
      console.log('❌ Failed to create service with translation');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response?.data?.details) {
      console.error('📋 Error details:', error.response.data.details);
    }
  }
}

testAdminTranslation();