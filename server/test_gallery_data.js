// Load environment variables from .env.local
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

import GoogleSheetsService from './src/services/googleSheetsService.js';

async function testGalleryData() {
  try {
    const service = GoogleSheetsService;
    await service.initialize();
    const data = await service.getData('Gallery');
    console.log('Raw Google Sheets data:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.length > 0) {
      console.log('\nHeaders:', data[0]);
      if (data.length > 1) {
        console.log('\nFirst data row:', data[1]);
        console.log('\nSecond data row:', data[2]);
        
        // Let's also check what the ID looks like in each row
        console.log('\n=== ID Analysis ===');
        data.slice(1).forEach((row, index) => {
          console.log(`Row ${index + 1}:`, row);
        });
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testGalleryData();