const GoogleSheetsService = require('./server/src/services/googleSheetsService').default;

async function fixServiceIdsMismatch() {
  try {
    console.log('🔄 Fixing Service ID mismatch...\n');
    
    // Get current services
    const services = await GoogleSheetsService.getData('Vehicle_Services');
    console.log(`📋 Found ${services.length} services`);
    
    if (services.length <= 1) {
      console.log('❌ No services found to fix');
      return;
    }
    
    // Get current prices
    const prices = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    console.log(`💰 Found ${prices.length} prices`);
    
    if (prices.length <= 1) {
      console.log('❌ No prices found to fix');
      return;
    }
    
    // Create mapping from old format to new format
    const serviceMapping = {};
    services.slice(1).forEach((service, index) => {
      const oldId = service[0]; // vehicle_service_1764849224717
      const newId = `service_${index + 1}`; // service_1, service_2, etc.
      serviceMapping[oldId] = newId;
      console.log(`📝 Mapping: "${oldId}" → "${newId}"`);
    });
    
    console.log('\n🔄 Updating prices with new Service_IDs...');
    
    // Update prices with new Service_IDs
    let updatedCount = 0;
    for (let i = 1; i < prices.length; i++) {
      const priceRow = prices[i];
      const currentServiceId = priceRow[1]; // Current Service_ID
      
      // Find the corresponding service
      let found = false;
      for (const [oldId, newId] of Object.entries(serviceMapping)) {
        if (currentServiceId === oldId || currentServiceId === '1') {
          // Update this price row
          priceRow[1] = newId;
          
          // Update in Google Sheets (row index is 1-based, and we skip header)
          await GoogleSheetsService.updateData('Vehicle_Service_Prices', i + 1, priceRow);
          console.log(`✅ Updated price row ${i}: Service_ID "${currentServiceId}" → "${newId}"`);
          updatedCount++;
          found = true;
          break;
        }
      }
      
      if (!found && currentServiceId === '1') {
        // Special case: if Service_ID is "1", map to first service
        const firstNewId = Object.values(serviceMapping)[0];
        priceRow[1] = firstNewId;
        await GoogleSheetsService.updateData('Vehicle_Service_Prices', i + 1, priceRow);
        console.log(`✅ Updated price row ${i}: Service_ID "${currentServiceId}" → "${firstNewId}" (default)`);
        updatedCount++;
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} prices!`);
    console.log('✅ Service ID mismatch has been fixed!');
    
  } catch (error) {
    console.error('❌ Error fixing service IDs:', error.message);
    console.error(error.stack);
  }
}

fixServiceIdsMismatch();