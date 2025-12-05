const GoogleSheetsService = require('./server/src/services/googleSheetsService.js').default;

async function fixServiceIdsInPrices() {
  try {
    console.log('🔧 Fixing Service_ID mismatch in prices...');
    
    // Get services data to see available service IDs
    const servicesData = await GoogleSheetsService.getData('Vehicle_Services');
    console.log('\n📋 Available Services:');
    
    const serviceMap = {};
    if (servicesData.length > 1) {
      const headers = servicesData[0];
      const idIndex = headers.indexOf('ID');
      const nameIndex = headers.indexOf('Name_EN');
      const isActiveIndex = headers.indexOf('Is_Active');
      
      servicesData.slice(1).forEach((row, index) => {
        const id = row[idIndex];
        const name = row[nameIndex];
        const isActive = row[isActiveIndex];
        if (id && (isActive === 'true' || isActive === true)) {
          serviceMap[id] = name;
          console.log(`Service ID: ${id}, Name: ${name}`);
        }
      });
    }
    
    const availableServiceIds = Object.keys(serviceMap);
    console.log(`\n✅ Found ${availableServiceIds.length} active services:`, availableServiceIds);
    
    if (availableServiceIds.length === 0) {
      console.log('❌ No active services found. Cannot fix prices.');
      return;
    }
    
    // Get current prices data
    const pricesData = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    console.log('\n💰 Current Prices Analysis:');
    
    if (pricesData.length > 1) {
      const headers = pricesData[0];
      const idIndex = headers.indexOf('ID');
      const serviceIdIndex = headers.indexOf('Service_ID');
      const bodyTypeIndex = headers.indexOf('Body_Type_ID');
      const priceMinIndex = headers.indexOf('Price_Min');
      const isActiveIndex = headers.indexOf('Is_Active');
      
      const pricesToUpdate = [];
      const invalidServiceIds = new Set();
      
      pricesData.slice(1).forEach((row, index) => {
        const id = row[idIndex];
        const currentServiceId = row[serviceIdIndex];
        const bodyType = row[bodyTypeIndex];
        const priceMin = row[priceMinIndex];
        const isActive = row[isActiveIndex];
        
        // Check if current Service_ID is valid
        if (!availableServiceIds.includes(currentServiceId.toString())) {
          invalidServiceIds.add(currentServiceId);
          
          // Find a valid service ID to use (use the first one as default)
          const newServiceId = availableServiceIds[0];
          
          pricesToUpdate.push({
            rowIndex: index + 2, // +1 for header row, +1 for 1-based indexing
            priceId: id,
            currentServiceId: currentServiceId,
            newServiceId: newServiceId,
            bodyType: bodyType,
            priceMin: priceMin
          });
          
          console.log(`Price ID ${id}: Service_ID ${currentServiceId} → ${newServiceId} (Body: ${bodyType}, Price: ${priceMin})`);
        }
      });
      
      console.log(`\n📊 Summary:`);
      console.log(`- Total prices: ${pricesData.length - 1}`);
      console.log(`- Prices with invalid Service_ID: ${pricesToUpdate.length}`);
      console.log(`- Invalid Service_IDs found:`, Array.from(invalidServiceIds));
      console.log(`- Available Service_IDs:`, availableServiceIds);
      
      if (pricesToUpdate.length > 0) {
        console.log(`\n🔄 Updating ${pricesToUpdate.length} prices...`);
        
        // Update prices in batches
        const batchSize = 10;
        for (let i = 0; i < pricesToUpdate.length; i += batchSize) {
          const batch = pricesToUpdate.slice(i, i + batchSize);
          console.log(`Updating batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(pricesToUpdate.length / batchSize)}...`);
          
          for (const price of batch) {
            try {
              await GoogleSheetsService.updateData('Vehicle_Service_Prices', price.rowIndex, {
                'Service_ID': price.newServiceId
              });
              console.log(`✅ Updated price ${price.priceId}: Service_ID ${price.currentServiceId} → ${price.newServiceId}`);
            } catch (error) {
              console.error(`❌ Failed to update price ${price.priceId}:`, error.message);
            }
          }
          
          // Small delay between batches to avoid rate limiting
          if (i + batchSize < pricesToUpdate.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        console.log('\n✅ Service_ID fix completed!');
      } else {
        console.log('\n✅ All prices already have valid Service_IDs!');
      }
    }
    
  } catch (error) {
    console.error('❌ Error fixing Service_IDs:', error.message);
  }
}

fixServiceIdsInPrices();