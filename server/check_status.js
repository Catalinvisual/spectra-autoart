import axios from 'axios';

async function checkServerStatus() {
  console.log('🔍 Checking server status...');
  
  try {
    const response = await axios.get('http://localhost:8081/debug');
    console.log('✅ Server debug info:', response.data);
  } catch (error) {
    console.error('❌ Error getting debug info:', error.message);
  }
}

checkServerStatus();