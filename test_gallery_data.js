// Load environment variables from .env.local
require('dotenv').config({ path: './server/.env.local' });

const GoogleSheetsService = require('./server/src/services/googleSheetsService.js').default;

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
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testGalleryData();