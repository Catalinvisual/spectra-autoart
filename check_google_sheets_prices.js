import GoogleSheetsService from './server/src/services/googleSheetsService.js';

async function checkServicePrices() {
  try {
    console.log('🔍 Initializing Google Sheets service...');
    await GoogleSheetsService.initialize();
    
    const serviceId = 176504996;
    console.log(`📊 Checking prices for service ID: ${serviceId}`);
    
    // Get the Vehicle_Service_Prices sheet
    const sheet = GoogleSheetsService.doc.sheetsByTitle['Vehicle_Service_Prices'];
    if (!sheet) {
      throw new Error('Vehicle_Service_Prices sheet not found');
    }
    
    const rows = await sheet.getRows();
    console.log(`📋 Found ${rows.length} total price entries in Google Sheets`);
    
    // Filter prices for our service
    const servicePrices = rows.filter(row => {
      const rowServiceId = row.get('Service_ID');
      return rowServiceId && rowServiceId.toString() === serviceId.toString();
    });
    
    console.log(`💰 Found ${servicePrices.length} prices for service ${serviceId}:`);
    servicePrices.forEach(row => {
      const bodyTypeKey = row.get('Body_Type_Key');
      const priceMin = row.get('Price_Min');
      const currency = row.get('Currency');
      const duration = row.get('Duration_Minutes');
      
      console.log(`  - ${bodyTypeKey}: €${priceMin} (${duration} min)`);
    });
    
    if (servicePrices.length === 0) {
      console.log('⚠️  No prices found for this service in Google Sheets');
      console.log('📋 Showing last 5 entries from Google Sheets:');
      const lastRows = rows.slice(-5);
      lastRows.forEach(row => {
        console.log(`  - Service ${row.get('Service_ID')} - ${row.get('Body_Type_Key')}: €${row.get('Price_Min')}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking Google Sheets:', error.message);
  }
}

checkServicePrices();