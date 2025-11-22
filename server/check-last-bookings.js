import GoogleSheetsService from './src/services/googleSheetsService.js';

async function checkLastBookings() {
  try {
    await GoogleSheetsService.initialize();
    const bookingsData = await GoogleSheetsService.getData('Bookings');
    
    console.log('Bookings sheet data (last 5 rows):');
    if (bookingsData.length > 0) {
      console.log('Headers:', bookingsData[0]);
      console.log('Last few rows:');
      const lastRows = bookingsData.slice(-5);
      lastRows.forEach((row, index) => {
        console.log(`Row ${bookingsData.length - lastRows.length + index + 1}:`, row);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkLastBookings();