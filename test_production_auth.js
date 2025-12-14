import axios from 'axios';

// Production API base URL
const API_BASE = 'https://railway-bulletproof-v2-production.up.railway.app/api';

// Correct admin credentials from .env
const ADMIN_EMAIL = 'admin@spectra.com';
const ADMIN_PASSWORD = 'admin123';

// Generated JWT token (valid for 24 hours)
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1NzM4MjgxLCJleHAiOjE3NjU4MjQ2ODF9.9X_P4kks-HsPScjBaJVfNAAoV_qRVd6Gzzg1X019yIA';

async function testAuthentication() {
  console.log('🧪 Testing admin authentication...\n');
  
  try {
    // Test 1: Login with correct credentials
    console.log('1️⃣ Testing login with correct credentials...');
    const loginResponse = await axios.post(`${API_BASE}/admin/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      console.log('📋 Token:', loginResponse.data.token);
    } else {
      console.log('❌ Login failed:', loginResponse.data.error);
    }
    
    // Test 2: Access protected endpoint with token
    console.log('\n2️⃣ Testing protected endpoint access...');
    const dashboardResponse = await axios.get(`${API_BASE}/admin/dashboard`, {
      headers: { 
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (dashboardResponse.status === 200) {
      console.log('✅ Dashboard access successful');
      console.log('📊 Dashboard data:', dashboardResponse.data);
    } else {
      console.log('❌ Dashboard access failed:', dashboardResponse.status);
    }
    
    // Test 3: Test other admin endpoints
    console.log('\n3️⃣ Testing other admin endpoints...');
    
    const endpoints = [
      '/admin/bookings',
      '/admin/body-types',
      '/admin/newsletter-subscribers'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${API_BASE}${endpoint}`, {
          headers: { 
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200) {
          console.log(`✅ ${endpoint} - Access successful`);
        } else if (response.status === 503) {
          console.log(`⚠️  ${endpoint} - Service unavailable (Google Sheets demo mode)`);
        } else {
          console.log(`❌ ${endpoint} - Status: ${response.status}`);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`❌ ${endpoint} - Unauthorized (401)`);
        } else if (error.response?.status === 503) {
          console.log(`⚠️  ${endpoint} - Service unavailable (Google Sheets demo mode)`);
        } else {
          console.log(`❌ ${endpoint} - Error: ${error.response?.status || error.message}`);
        }
      }
    }
    
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('❌ Server not found (404) - Application may still be deploying');
    } else if (error.response?.status === 401) {
      console.log('❌ Authentication failed (401) - Check token validity');
      console.log('🔑 Current token:', AUTH_TOKEN);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused - Server may be down');
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }
}

// Run the test
testAuthentication();