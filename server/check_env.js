import axios from 'axios';

async function checkEnvVars() {
  console.log('🔍 Checking server environment variables...');
  
  try {
    const response = await axios.get('http://localhost:8081/debug/env');
    console.log('✅ Environment variables:', response.data);
  } catch (error) {
    console.error('❌ Error getting environment info:', error.message);
    
    // Try the basic debug endpoint
    try {
      const response = await axios.get('http://localhost:8081/debug');
      console.log('✅ Basic debug info:', response.data);
    } catch (error2) {
      console.error('❌ Basic debug also failed:', error2.message);
    }
  }
}

checkEnvVars();