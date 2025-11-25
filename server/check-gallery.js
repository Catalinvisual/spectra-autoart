const GoogleSheetsService = require('./src/services/googleSheetsService.js');

async function checkGalleryData() {
  try {
    const data = await GoogleSheetsService.getData('Gallery');
    console.log('Raw data from Google Sheets:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkGalleryData();
