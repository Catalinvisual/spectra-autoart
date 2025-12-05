import GoogleSheetsService from './src/services/googleSheetsService.js';
import dotenv from 'dotenv';

dotenv.config();

async function debugSheets() {
  try {
    console.log('🔍 Debugging Google Sheets data...');
    
    // Initialize Google Sheets service
    console.log('📊 SPREADSHEET_ID:', process.env.SPREADSHEET_ID);
    console.log('📧 SERVICE_ACCOUNT_EMAIL:', process.env.SERVICE_ACCOUNT_EMAIL);
    console.log('🔑 PRIVATE_KEY exists:', !!process.env.PRIVATE_KEY);
    
    await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets service initialized');
    
    // Get Vehicle_Services data
    const vehicleServices = await GoogleSheetsService.getData('Vehicle_Services');
    console.log('\n📊 Vehicle_Services sheet:');
    console.log('Headers:', vehicleServices[0]);
    console.log('First 5 rows of data:');
    vehicleServices.slice(1, 6).forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });

    // Check for Is_Active column specifically
    const headers = vehicleServices[0];
    const isActiveIndex = headers.indexOf('Is_Active');
    console.log(`\n🔍 Is_Active column index: ${isActiveIndex}`);
    
    if (isActiveIndex !== -1) {
      console.log('Is_Active values in first 10 data rows:');
      vehicleServices.slice(1, 11).forEach((row, index) => {
        console.log(`Row ${index + 1}: "${row[isActiveIndex]}" (type: ${typeof row[isActiveIndex]})`);
      });
    }

    // Check for our newly added service
    const serviceIdIndex = headers.indexOf('ID');
    if (serviceIdIndex !== -1) {
      const ourService = vehicleServices.slice(1).find(row => row[serviceIdIndex] && row[serviceIdIndex].includes('service-1764927015387'));
      if (ourService) {
        console.log('\n🎯 Found our test service:');
        console.log('Full row:', ourService);
        if (isActiveIndex !== -1) {
          console.log(`Is_Active value: "${ourService[isActiveIndex]}"`);
        }
      } else {
        console.log('\n❌ Our test service not found in sheet');
      }
    }

  } catch (error) {
    console.error('❌ Error debugging sheets:', error);
  }
}

debugSheets();