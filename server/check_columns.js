import GoogleSheetsService from './src/services/googleSheetsService.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkPriceSheetColumns() {
  try {
    console.log('🔍 Checking Vehicle_Service_Prices columns...');
    
    await GoogleSheetsService.initialize();
    
    // Get Vehicle_Service_Prices data
    const vehiclePrices = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    
    if (vehiclePrices.length === 0) {
      console.log('❌ No data found in Vehicle_Service_Prices sheet');
      return;
    }
    
    console.log('📊 Headers in Vehicle_Service_Prices:');
    const headers = vehiclePrices[0];
    headers.forEach((header, index) => {
      console.log(`Column ${index}: "${header}"`);
    });
    
    console.log('\n📊 First few data rows:');
    vehiclePrices.slice(1, 5).forEach((row, index) => {
      console.log(`Row ${index + 2}:`);
      row.forEach((cell, colIndex) => {
        if (cell) {
          console.log(`  ${headers[colIndex] || `Column ${colIndex}`}: "${cell}"`);
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error checking columns:', error);
  }
}

checkPriceSheetColumns();