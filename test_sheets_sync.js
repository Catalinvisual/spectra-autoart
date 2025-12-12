const axios = require('axios');

const API_BASE = 'http://localhost:8081/api';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTU2NjE1NSwiZXhwIjoxNzY1NTY5NzU1fQ.NxE0iXRXv5DprvDBAQrARNFuMascXCyHcUjf84KSC1c';

async function testSheetsSync() {
  console.log('🧪 Testing Google Sheets sync after booking update...\n');
  
  try {
    // Get initial availability
    console.log('📅 Getting initial availability...');
    const initialResponse = await axios.get(`${API_BASE}/public/bookings/availability`);
    const initialBookedDates = initialResponse.data.bookedDates;
    console.log(`Initial booked dates count: ${initialBookedDates.length}`);
    console.log('Sample dates:', initialBookedDates.slice(0, 5));
    
    // Get a booking to update
    console.log('\n📋 Getting bookings...');
    const bookingsResponse = await axios.get(`${API_BASE}/admin/bookings`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
    const bookings = bookingsResponse.data;
    console.log(`Found ${bookings.length} bookings`);
    
    if (bookings.length === 0) {
      console.log('❌ No bookings found');
      return;
    }
    
    // Select a booking
    const booking = bookings[0];
    console.log(`Selected booking: ID=${booking.id}, Date=${booking.date}`);
    
    // Update the booking date
    const newDate = '2025-12-31'; // New Year's Eve
    console.log(`\n🔄 Updating booking ${booking.id} date from ${booking.date} to ${newDate}...`);
    
    const updateResponse = await axios.put(
      `${API_BASE}/admin/bookings/${booking.id}`,
      { date: newDate },
      { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
    );
    
    console.log('Update result:', updateResponse.data);
    
    // Wait a moment for Google Sheets to sync
    console.log('\n⏳ Waiting 2 seconds for Google Sheets sync...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check availability again
    console.log('\n📅 Getting updated availability...');
    const updatedResponse = await axios.get(`${API_BASE}/public/bookings/availability`);
    const updatedBookedDates = updatedResponse.data.bookedDates;
    console.log(`Updated booked dates count: ${updatedBookedDates.length}`);
    console.log('Sample dates:', updatedBookedDates.slice(0, 5));
    
    // Check if changes are reflected
    const oldDateStillBooked = updatedBookedDates.includes(booking.date);
    const newDateBooked = updatedBookedDates.includes(newDate);
    
    console.log('\n🔍 Verification:');
    console.log(`- Old date (${booking.date}) still booked: ${oldDateStillBooked}`);
    console.log(`- New date (${newDate}) is now booked: ${newDateBooked}`);
    
    if (!oldDateStillBooked && newDateBooked) {
      console.log('✅ Google Sheets sync is working correctly!');
    } else {
      console.log('⚠️  Google Sheets sync may have issues');
      console.log('This could be due to:');
      console.log('  - Multiple bookings on the same date');
      console.log('  - Google Sheets API delay');
      console.log('  - Caching issues');
    }
    
    // Restore original date
    console.log(`\n🔄 Restoring original date ${booking.date}...`);
    await axios.put(
      `${API_BASE}/admin/bookings/${booking.id}`,
      { date: booking.date },
      { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
    );
    
    console.log('\n✅ Test completed!');
    
  } catch (error) {
    console.error('❌ Error during test:', error.response?.data || error.message);
  }
}

testSheetsSync();