import fetch from 'node-fetch';

async function testPatchBooking() {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1Nzk5MjQyLCJleHAiOjE3NjU4ODU2NDJ9.BvOkwI5r7ng7slWp9CFH-mO_X6lrs9nMnsOm-twxHGY';
    
    console.log('🧪 Testing PATCH booking endpoint with new data...');
    
    const updateData = {
      name: 'Updated Name Again',
      status: 'confirmed',
      date: '2026-01-10',
      time: '14:30'
    };
    
    console.log('📤 Sending PATCH request with data:', JSON.stringify(updateData, null, 2));
    
    const patchResponse = await fetch('http://localhost:8081/api/admin/bookings/1765476764436', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    console.log('📊 Response status:', patchResponse.status);
    
    if (patchResponse.ok) {
      const responseData = await patchResponse.json();
      console.log('✅ PATCH Response:', JSON.stringify(responseData, null, 2));
      
      // Now verify the changes by getting the booking again
      console.log('\n🔍 Verifying changes...');
      const getResponse = await fetch('http://localhost:8081/api/admin/bookings/1765476764436', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const bookingData = await getResponse.json();
      console.log('📊 Updated booking data:', JSON.stringify(bookingData, null, 2));
      
      // Check if all changes were applied
      const checks = [
        { field: 'name', expected: updateData.name, actual: bookingData.name },
        { field: 'status', expected: updateData.status, actual: bookingData.status },
        { field: 'date', expected: updateData.date, actual: bookingData.date },
        { field: 'time', expected: updateData.time, actual: bookingData.time }
      ];
      
      console.log('\n✅ Verification results:');
      checks.forEach(check => {
        const passed = check.expected === check.actual;
        console.log(`  ${check.field}: ${check.actual} ${passed ? '✅' : '❌'} (expected: ${check.expected})`);
      });
      
      const allPassed = checks.every(check => check.expected === check.actual);
      console.log(`\n${allPassed ? '🎉 All changes persisted successfully!' : '❌ Some changes did not persist'}`);
      
    } else {
      console.log('❌ PATCH request failed with status:', patchResponse.status);
      const errorData = await patchResponse.text();
      console.log('❌ Error response:', errorData);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPatchBooking();