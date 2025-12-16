import axios from 'axios';

const API_BASE = 'http://localhost:8081/api';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1Nzk5MjQyLCJleHAiOjE3NjU4ODU2NDJ9.BvOkwI5r7ng7slWp9CFH-mO_X6lrs9nMnsOm-twxHGY';

async function testCancellationEmail() {
  try {
    console.log('🧪 Testing cancellation email functionality...');
    
    // First, get a booking to test with
    console.log('📋 Getting bookings...');
    const bookingsResponse = await axios.get(`${API_BASE}/admin/bookings`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    });
    
    const bookings = bookingsResponse.data;
    const testBooking = bookings.find(b => b.status !== 'canceled' && b.status !== 'cancelled');
    
    if (!testBooking) {
      console.log('❌ No suitable booking found for testing (all are already canceled)');
      return;
    }
    
    console.log(`🎯 Selected booking ${testBooking.id} with current status: ${testBooking.status}`);
    console.log(`📅 Booking details: ${testBooking.date} at ${testBooking.time}`);
    console.log(`🚗 Vehicle: ${testBooking.make} ${testBooking.model} (${testBooking.body})`);
    console.log(`👤 Customer: ${testBooking.customer_name} (${testBooking.customer_email})`);
    
    // Update the booking status to canceled
    console.log('\n📧 Updating booking status to canceled...');
    const updateResponse = await axios.patch(
      `${API_BASE}/admin/bookings/${testBooking.id}`,
      { status: 'canceled' },
      { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
    );
    
    console.log('✅ Update response:', updateResponse.data);
    
    // Wait a moment to allow email sending
    console.log('\n⏳ Waiting for email to be sent...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verify the booking was updated
    console.log('\n🔍 Verifying booking status update...');
    const verifyResponse = await axios.get(`${API_BASE}/admin/bookings`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    });
    
    const updatedBooking = verifyResponse.data.find(b => b.id === testBooking.id);
    if (updatedBooking && updatedBooking.status === 'canceled') {
      console.log('✅ Booking status successfully updated to canceled');
      console.log('📧 Cancellation email should have been sent to the client');
    } else {
      console.log('❌ Booking status was not updated correctly');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Run the test
testCancellationEmail();