import axios from 'axios';

async function testAdminEndpoints() {
  console.log('🔍 Testing admin endpoints directly...');
  
  const baseURL = 'https://spectraautoart.nl/api';
  
  try {
    // Test dashboard without auth first
    console.log('📊 Testing /admin/dashboard (no auth)...');
    const dashboardResponse = await axios.get(`${baseURL}/admin/dashboard`);
    console.log('Dashboard response:', dashboardResponse.status, dashboardResponse.data);
  } catch (error) {
    console.log('Dashboard error:', error.response?.status, error.response?.data);
  }
  
  try {
    // Test bookings without auth
    console.log('📋 Testing /admin/bookings (no auth)...');
    const bookingsResponse = await axios.get(`${baseURL}/admin/bookings`);
    console.log('Bookings response:', bookingsResponse.status, bookingsResponse.data);
  } catch (error) {
    console.log('Bookings error:', error.response?.status, error.response?.data);
  }
  
  try {
    // Test health check to see if server is responding
    console.log('🏥 Testing /health...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('Health response:', healthResponse.status, healthResponse.data);
  } catch (error) {
    console.log('Health error:', error.response?.status, error.response?.data);
  }
}

testAdminEndpoints();