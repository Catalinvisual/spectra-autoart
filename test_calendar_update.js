const axios = require('axios');

const API_BASE = 'http://localhost:8081/api';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTU2NTQxOSwiZXhwIjoxNzY1NTY5MDE5fQ.HwiCmrIdoz8zRslXKjq7zKxBmt_sotzV0dvOhWogf1Y';

const adminAPI = {
  getBookings: async () => {
    const response = await axios.get(`${API_BASE}/admin/bookings`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    });
    return response.data;
  },
  
  updateBooking: async (id, data) => {
    const response = await axios.patch(`${API_BASE}/admin/bookings/${id}`, data, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    });
    return response.data;
  },
  
  getAvailability: async () => {
    const response = await axios.get(`${API_BASE}/public/bookings/availability`);
    return response.data;
  }
};

async function testCalendarUpdate() {
  try {
    console.log('🧪 Testing calendar color update functionality...\n');
    
    // 1. Obține toate programările existente
    console.log('📋 Getting existing bookings...');
    const bookings = await adminAPI.getBookings();
    console.log(`Found ${bookings.length} bookings`);
    
    if (bookings.length === 0) {
      console.log('❌ No bookings found to test with');
      return;
    }
    
    // 2. Obține datele ocupate inițial
    console.log('\n📅 Getting initial booked dates...');
    const initialAvailability = await adminAPI.getAvailability();
    console.log('Initial availability response:', JSON.stringify(initialAvailability, null, 2));
    const initialBookedDates = initialAvailability.bookedDates || initialAvailability.data?.bookedDates || [];
    console.log('Initial booked dates:', initialBookedDates);
    
    // 3. Alege o programare de testat
    const testBooking = bookings[0];
    console.log(`\n📝 Selected booking: ID=${testBooking.id}, Date=${testBooking.date}, Status=${testBooking.status}`);
    
    // 4. Găsește o dată nouă (diferită de cea curentă)
    const currentDate = new Date(testBooking.date);
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7); // Adaugă 7 zile
    const newDateString = newDate.toISOString().split('T')[0];
    
    console.log(`\n🔄 Updating booking date from ${testBooking.date} to ${newDateString}...`);
    
    // 5. Actualizează programarea
    const updateResult = await adminAPI.updateBooking(testBooking.id, {
      date: newDateString,
      time: testBooking.time,
      status: testBooking.status
    });
    
    console.log('✅ Update result:', updateResult.message || 'Success');
    
    // 7. Verifică din nou datele ocupate
    console.log('\n📅 Getting updated booked dates...');
    const updatedAvailability = await adminAPI.getAvailability();
    console.log('Updated availability response:', JSON.stringify(updatedAvailability, null, 2));
    const updatedBookedDates = updatedAvailability.bookedDates || updatedAvailability.data?.bookedDates || [];
    console.log('Updated booked dates:', updatedBookedDates);
    
    // 8. Verifică logică
    const oldDateStillBooked = updatedBookedDates.includes(testBooking.date);
    const newDateBooked = updatedBookedDates.includes(newDateString);
    
    console.log('\n🔍 Verification:');
    console.log(`- Old date (${testBooking.date}) still booked: ${oldDateStillBooked}`);
    console.log(`- New date (${newDateString}) is now booked: ${newDateBooked}`);
    
    // 9. Testează ștergerea
    console.log('\n🗑️ Testing booking deletion...');
    
    // Creează o programare temporară pentru testare
    const tempBookingData = {
      customer_name: 'Test User',
      customer_email: 'test@example.com',
      customer_phone: '+31612345678',
      date: '2024-12-25',
      time: '14:00',
      services: ['Exterior Wash'],
      total: 50,
      status: 'pending',
      vehicle_make: 'Test',
      vehicle_model: 'Car',
      vehicle_body: 'Sedan'
    };
    
    console.log('✅ Calendar update functionality test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

// Rulează testul
testCalendarUpdate();