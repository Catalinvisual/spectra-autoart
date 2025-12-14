import axios from 'axios';

async function checkServer() {
  console.log('🔍 Checking what server is running on port 8081...');
  
  try {
    const response = await axios.get('http://localhost:8081/health', {
      timeout: 5000
    });
    console.log('✅ Health endpoint response:', response.data);
  } catch (error) {
    console.log('❌ Health endpoint not available');
    
    try {
      const response = await axios.get('http://localhost:8081/', {
        timeout: 5000
      });
      console.log('✅ Root endpoint response type:', typeof response.data);
      console.log('✅ Response length:', response.data.length);
      console.log('✅ First 200 chars:', response.data.substring(0, 200));
    } catch (error2) {
      console.error('❌ Root endpoint also failed:', error2.message);
    }
  }
}

checkServer();