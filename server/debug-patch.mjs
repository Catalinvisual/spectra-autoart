// Simple debug script to test the PATCH endpoint
import fetch from 'node-fetch';

async function testPatch() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1Nzk5MjQyLCJleHAiOjE3NjU4ODU2NDJ9.BvOkwI5r7ng7slWp9CFH-mO_X6lrs9nMnsOm-twxHGY';
  
  // First, get the current booking data
  console.log('🔍 Getting current booking data...');
  const getResponse = await fetch('http://localhost:8081/api/admin/bookings/1765476764436?fresh=true', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const currentData = await getResponse.json();
  console.log('📊 Current booking data:', JSON.stringify(currentData, null, 2));
  
  // Now try to update it
  console.log('\n📝 Attempting to update booking...');
  const updateData = {
    status: 'cancelled',
    name: 'Test Name Updated'
  };
  
  const patchResponse = await fetch('http://localhost:8081/api/admin/bookings/1765476764436', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  
  const patchResult = await patchResponse.json();
  console.log('📤 Patch response:', JSON.stringify(patchResult, null, 2));
  
  // Wait a moment and check again
  console.log('\n⏳ Waiting 2 seconds...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('🔍 Getting updated booking data...');
  const updatedResponse = await fetch('http://localhost:8081/api/admin/bookings/1765476764436?fresh=true', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const updatedData = await updatedResponse.json();
  console.log('📊 Updated booking data:', JSON.stringify(updatedData, null, 2));
  
  // Compare
  console.log('\n🔍 Comparison:');
  console.log('Status - Before:', currentData.status, 'After:', updatedData.status, 'Expected:', updateData.status);
  console.log('Name - Before:', currentData.user.name, 'After:', updatedData.user.name, 'Expected:', updateData.name);
}

testPatch().catch(console.error);