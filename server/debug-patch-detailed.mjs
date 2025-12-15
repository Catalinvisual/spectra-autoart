// Debug script to test PATCH endpoint with detailed logging
import fetch from 'node-fetch';

async function debugPatch() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1Nzk5MjQyLCJleHAiOjE3NjU4ODU2NDJ9.BvOkwI5r7ng7slWp9CFH-mO_X6lrs9nMnsOm-twxHGY';
  
  console.log('🧪 Testing PATCH endpoint with detailed logging...');
  
  const updateData = {
    status: 'cancelled',
    name: 'Test Name Updated'
  };
  
  console.log('📤 Sending PATCH request with data:', JSON.stringify(updateData, null, 2));
  
  try {
    const patchResponse = await fetch('http://localhost:8081/api/admin/bookings/1765476764436', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    console.log('📊 Response status:', patchResponse.status);
    console.log('📊 Response headers:', Object.fromEntries(patchResponse.headers.entries()));
    
    const responseText = await patchResponse.text();
    console.log('📄 Raw response:', responseText);
    
    try {
      const patchResult = JSON.parse(responseText);
      console.log('📤 Parsed response:', JSON.stringify(patchResult, null, 2));
    } catch (parseError) {
      console.log('❌ Failed to parse JSON response:', parseError.message);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
}

debugPatch();