import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '.env') });

import GoogleSheetsService from './src/services/googleSheetsService.js';

async function checkSheetsData() {
  try {
    console.log('🔄 Initializing Google Sheets Service...');
    await GoogleSheetsService.initialize();
    
    console.log('\n📊 Checking Bookings sheet data:');
    const bookingsData = await GoogleSheetsService.getData('Bookings');
    
    console.log(`📋 Total rows: ${bookingsData.length}`);
    
    if (bookingsData.length > 0) {
      console.log('📋 Headers:', bookingsData[0]);
      console.log('\n📋 First few data rows:');
      bookingsData.slice(1, 4).forEach((row, index) => {
        console.log(`Row ${index + 2}:`, row);
      });
    }
    
    console.log('\n✅ Check completed successfully!');
    
  } catch (error) {
    console.error('❌ Error checking sheets data:', error);
  }
}

checkSheetsData();