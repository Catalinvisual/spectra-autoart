import axios from 'axios';

async function testCancelBooking() {
  try {
    // First, let's get the existing booking to see its current status
    console.log('🔍 Getting current booking details...');
    
    const getResponse = await axios.get('http://localhost:8081/api/admin/bookings/1765838478602', {
              headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTg2ODE5Mn0.VwzV27bRq1LSO_w1iBjhDJTLDzYUxBIq1yrBn_XTeMw'
              }
            });
    
    console.log('📋 Current booking details:', JSON.stringify(getResponse.data, null, 2));
    
    // Now update the status to cancelled
    console.log('\n🔄 Updating booking status to cancelled...');
    
    const updateResponse = await axios.put('http://localhost:8081/api/bookings/1765838478602/status', {
              status: 'cancelled'
            }, {
              headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTg2ODE5Mn0.VwzV27bRq1LSO_w1iBjhDJTLDzYUxBIq1yrBn_XTeMw',
                'Content-Type': 'application/json'
              }
            });
    
    console.log('✅ Status update response:', updateResponse.data);
    
    // Get the booking again to see the updated status
    console.log('\n🔍 Getting updated booking details...');
    
    const updatedResponse = await axios.get('http://localhost:8081/api/admin/bookings/1765838478602', {
              headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTg2ODE5Mn0.VwzV27bRq1LSO_w1iBjhDJTLDzYUxBIq1yrBn_XTeMw'
              }
            });
    
    console.log('📋 Updated booking details:', JSON.stringify(updatedResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing cancellation:', error.response?.data || error.message);
  }
}

testCancelBooking();