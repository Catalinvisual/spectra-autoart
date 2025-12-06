import GoogleSheetsService from './src/services/googleSheetsService.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixService2Prices() {
  try {
    console.log('🔧 Fixing Service 2 prices...');
    
    await GoogleSheetsService.initialize();
    
    // Get current prices for service-1765004607200-898 (wrong ID)
    const vehiclePrices = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    
    if (vehiclePrices.length <= 1) {
      console.log('❌ No prices found in Google Sheets');
      return;
    }
    
    const headers = vehiclePrices[0];
    const serviceIdIndex = headers.indexOf('Service_ID');
    const bodyTypeIndex = headers.indexOf('Body_Type_Key');
    const priceIndex = headers.indexOf('Price_Min');
    
    if (serviceIdIndex === -1 || bodyTypeIndex === -1 || priceIndex === -1) {
      console.log('❌ Required columns not found');
      return;
    }
    
    console.log('📊 Current prices for wrong service ID:');
    const rowsToUpdate = [];
    
    vehiclePrices.slice(1).forEach((row, index) => {
      const serviceId = row[serviceIdIndex] || '';
      const bodyType = row[bodyTypeIndex] || '';
      const price = row[priceIndex] || '';
      
      if (serviceId === 'service-1765004607200-898') {
        console.log(`Row ${index + 2}: Service_ID="${serviceId}", Body_Type_Key="${bodyType}", Price_Min="${price}"`);
        rowsToUpdate.push({
          rowIndex: index + 2, // Google Sheets is 1-based, plus header row
          data: row,
          bodyType,
          price
        });
      }
    });
    
    if (rowsToUpdate.length === 0) {
      console.log('❌ No prices found for service-1765004607200-898');
      return;
    }
    
    console.log(`\n🔧 Updating ${rowsToUpdate.length} prices to use correct service ID...`);
    
    // Update each row to use the correct service ID for Service 2
    for (const rowInfo of rowsToUpdate) {
      const updatedRow = [...rowInfo.data];
      updatedRow[serviceIdIndex] = 'service-1765010178118-916'; // Correct Service 2 ID
      
      console.log(`Updating row ${rowInfo.rowIndex}: Body_Type_Key="${rowInfo.bodyType}", Price_Min="${rowInfo.price}" -> Service_ID="service-1765010178118-916"`);
      
      await GoogleSheetsService.updateData('Vehicle_Service_Prices', rowInfo.rowIndex, updatedRow);
    }
    
    console.log('\n✅ All prices updated successfully!');
    console.log('🔄 Restarting server to apply changes...');
    
  } catch (error) {
    console.error('❌ Error fixing Service 2 prices:', error);
  }
}

fixService2Prices();