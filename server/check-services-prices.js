import dotenv from 'dotenv'
import { GoogleSheetsService } from './src/services/googleSheetsService.js';

// Load environment variables
dotenv.config({ path: '.env.local' })

async function checkServicesAndPrices() {
  console.log('Starting Google Sheets check for Services and Prices...');
  const service = new GoogleSheetsService();
  try {
    console.log('Initializing service...');
    await service.initialize();
    
    console.log('\n=== SERVICES DATA ===');
    const servicesData = await service.getData('Services');
    console.log(`Services sheet: ${servicesData.length} rows, ${servicesData[0]?.length} columns`);
    if (servicesData.length > 0) {
      console.log('Headers:', servicesData[0]);
      console.log('All service rows:');
      servicesData.forEach((row, index) => {
        if (row.some(cell => cell !== '' && cell !== null && cell !== undefined)) {
          console.log(`Row ${index}:`, row);
        }
      });
    }
    
    console.log('\n=== SERVICE_PRICES DATA ===');
    const pricesData = await service.getData('Service_Prices');
    console.log(`Service_Prices sheet: ${pricesData.length} rows, ${pricesData[0]?.length} columns`);
    if (pricesData.length > 0) {
      console.log('Headers:', pricesData[0]);
      console.log('All price rows:');
      pricesData.forEach((row, index) => {
        if (row.some(cell => cell !== '' && cell !== null && cell !== undefined)) {
          console.log(`Row ${index}:`, row);
        }
      });
    }
    
    console.log('\n=== BOOKINGS DATA ===');
    const bookingsData = await service.getData('Bookings');
    console.log(`Bookings sheet: ${bookingsData.length} rows, ${bookingsData[0]?.length} columns`);
    if (bookingsData.length > 1) {
      console.log('Headers:', bookingsData[0]);
      console.log('Last 3 booking rows:');
      bookingsData.slice(-3).forEach((row, index) => {
        console.log(`Row ${bookingsData.length - 3 + index}:`, row);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

checkServicesAndPrices();