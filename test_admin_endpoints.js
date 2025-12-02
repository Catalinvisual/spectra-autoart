const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api';

async function testAdminEndpoints() {
  try {
    console.log('🧪 Testing admin endpoints without auth...');
    
    // Test body-types without auth
    try {
      console.log('\n📋 Testing /admin/body-types without auth...');
      const response1 = await axios.get(`${API_BASE_URL}/admin/body-types`);
      console.log('✅ Body-types response:', response1.data);
    } catch (error) {
      console.log('❌ Body-types error:', error.response?.status, error.response?.data);
    }
    
    // Test vehicle-services without auth
    try {
      console.log('\n🔧 Testing /admin/vehicle-services without auth...');
      const response2 = await axios.get(`${API_BASE_URL}/admin/vehicle-services`);
      console.log('✅ Vehicle-services response:', response2.data);
    } catch (error) {
      console.log('❌ Vehicle-services error:', error.response?.status, error.response?.data);
    }
    
    console.log('\n🧪 Testing admin endpoints with auth...');
    
    // First, get an auth token
    console.log('\n🔑 Getting auth token...');
    const loginResponse = await axios.post(`${API_BASE_URL}/admin/auth/login`, {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Got token:', token.substring(0, 20) + '...');
    
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test body-types with auth
    try {
      console.log('\n📋 Testing /admin/body-types with auth...');
      const response1 = await axios.get(`${API_BASE_URL}/admin/body-types`, { headers });
      console.log('✅ Body-types response:', response1.data);
    } catch (error) {
      console.log('❌ Body-types error:', error.response?.status, error.response?.data);
      console.log('❌ Body-types error details:', error.message);
    }
    
    // Test vehicle-services with auth
    try {
      console.log('\n🔧 Testing /admin/vehicle-services with auth...');
      const response2 = await axios.get(`${API_BASE_URL}/admin/vehicle-services`, { headers });
      console.log('✅ Vehicle-services response:', response2.data);
    } catch (error) {
      console.log('❌ Vehicle-services error:', error.response?.status, error.response?.data);
      console.log('❌ Vehicle-services error details:', error.message);
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
}

testAdminEndpoints();