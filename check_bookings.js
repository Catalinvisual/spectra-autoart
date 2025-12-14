import axios from 'axios';

async function checkBookings() {
  try {
    console.log('🔍 Checking current bookings...');
    
    const response = await axios.get('http://localhost:8081/api/admin/bookings', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMzY3NDI4OSwiZXhwIjoxNzMzNzYwNjg5fQ.8IikVqR7G5fFBSUIFL0B4qMS2f3oJ4iPV5JcXw5_9Js'
      }
    });
    
    console.log('📋 Bookings found:', response.data.length);
    response.data.forEach((booking, index) => {
      console.log(`  ${index + 1}. ID: ${booking.id}, Date: ${booking.date}, Customer: ${booking.customerName}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking bookings:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

checkBookings();