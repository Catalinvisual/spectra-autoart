import axios from 'axios';

async function testAdminWithAuth() {
  console.log('🔐 Testing admin endpoints with authentication...');
  
  const baseURL = 'https://spectraautoart.nl/api';
  
  try {
    // First, try to login to get a token
    console.log('🔑 Attempting to login...');
    const loginResponse = await axios.post(`${baseURL}/admin/auth/login`, {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    console.log('Login response:', loginResponse.status);
    
    if (loginResponse.data.token) {
      const token = loginResponse.data.token;
      console.log('✅ Got token:', token.substring(0, 20) + '...');
      
      // Test dashboard with auth
      console.log('📊 Testing /admin/dashboard with auth...');
      const dashboardResponse = await axios.get(`${baseURL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Dashboard response:', dashboardResponse.status, dashboardResponse.data);
      
      // Test bookings with auth
      console.log('📋 Testing /admin/bookings with auth...');
      const bookingsResponse = await axios.get(`${baseURL}/admin/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Bookings response:', bookingsResponse.status, bookingsResponse.data);
      
    } else {
      console.log('❌ No token in login response');
    }
    
  } catch (error) {
    console.log('❌ Login or admin test failed:', error.response?.status, error.response?.data);
    
    // If login fails, try to check what the actual error is
    if (error.response?.status === 401) {
      console.log('🔍 Login failed - checking if credentials are wrong or server issue');
    }
  }
}

testAdminWithAuth();