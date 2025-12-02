const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testNewsletterBooking() {
  console.log('🧪 Testing newsletter subscription during booking creation...\n');
  
  try {
    // Test data with newsletter subscription
    const bookingData = {
      date: '2025-12-01',
      time: '14:30',
      make: 'BMW',
      model: 'Seria 3',
      type: 'Sedan',
      body: 'Sedan',
      services: ['service-1', 'service-2'],
      user: {
        name: 'Test Newsletter User',
        email: 'test.newsletter@example.com',
        phone: '+1234567890'
      },
      locale: 'en',
      newsletter: true  // This should trigger newsletter subscription
    };
    
    console.log('📤 Sending booking request with newsletter=true...');
    console.log('Booking data:', JSON.stringify(bookingData, null, 2));
    
    const response = await axios.post(`${API_URL}/public/bookings`, bookingData);
    
    console.log('\n✅ Booking response:', response.data);
    
    if (response.data.success) {
      console.log('\n🎉 Booking created successfully!');
      console.log('📧 Newsletter subscription should be processed asynchronously...');
      console.log('⏳ Please check server logs for newsletter subscription confirmation');
      
      // Wait a bit to see async newsletter processing
      console.log('\n⏰ Waiting 5 seconds for async newsletter processing...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } else {
      console.log('\n❌ Booking creation failed:', response.data.error);
    }
    
  } catch (error) {
    console.error('\n❌ Error creating booking:', error.response?.data || error.message);
  }
}

// Test without newsletter
async function testBookingWithoutNewsletter() {
  console.log('\n\n🧪 Testing booking WITHOUT newsletter subscription...\n');
  
  try {
    const bookingData = {
      date: '2025-12-01',
      time: '15:00',
      make: 'Audi',
      model: 'A4',
      type: 'Sedan',
      body: 'Sedan',
      services: ['service-3'],
      user: {
        name: 'Test No Newsletter User',
        email: 'test.no.newsletter@example.com',
        phone: '+0987654321'
      },
      locale: 'en',
      newsletter: false  // No newsletter subscription
    };
    
    console.log('📤 Sending booking request with newsletter=false...');
    
    const response = await axios.post(`${API_URL}/public/bookings`, bookingData);
    
    console.log('\n✅ Booking response:', response.data);
    
    if (response.data.success) {
      console.log('\n🎉 Booking created successfully (no newsletter)!');
    }
    
  } catch (error) {
    console.error('\n❌ Error creating booking:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  await testNewsletterBooking();
  await testBookingWithoutNewsletter();
  console.log('\n✅ All tests completed!');
}

runTests().catch(console.error);