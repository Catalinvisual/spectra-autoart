import GoogleSheetsService from './server/src/services/googleSheetsService.js';
import dotenv from 'dotenv';

dotenv.config();

async function debugServiceIds() {
  try {
    console.log('🔍 Debugging Service IDs...');
    
    await GoogleSheetsService.initialize();
    
    // Get Vehicle_Services data
    const vehicleServices = await GoogleSheetsService.getData('Vehicle_Services');
    console.log('\n📊 Vehicle_Services sheet:');
    console.log('Total services:', vehicleServices.length - 1);
    
    const serviceIds = [];
    if (vehicleServices.length > 1) {
      vehicleServices.slice(1).forEach((row, index) => {
        const serviceId = row[0] || '';
        const name = row[1] || '';
        console.log(`Service ${index + 1}: ID="${serviceId}", Name="${name}"`);
        serviceIds.push(serviceId);
      });
    }
    
    // Get Vehicle_Service_Prices data
    const vehiclePrices = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    console.log('\n📊 Vehicle_Service_Prices sheet:');
    console.log('Total price rows:', vehiclePrices.length - 1);
    
    const priceServiceIds = {};
    if (vehiclePrices.length > 1) {
      vehiclePrices.slice(1).forEach((row, index) => {
        const serviceId = row[1] || '';
        const bodyType = row[2] || '';
        const price = row[3] || '';
        
        if (serviceId) {
          if (!priceServiceIds[serviceId]) {
            priceServiceIds[serviceId] = [];
          }
          priceServiceIds[serviceId].push({
            bodyType,
            price,
            row: index + 2
          });
        }
      });
    }
    
    console.log('\n📊 Service IDs with prices:');
    Object.keys(priceServiceIds).forEach(serviceId => {
      console.log(`Service ID "${serviceId}": ${priceServiceIds[serviceId].length} prices`);
      priceServiceIds[serviceId].forEach(price => {
        console.log(`  - ${price.bodyType}: €${price.price} (row ${price.row})`);
      });
    });
    
    // Check for missing prices
    console.log('\n🔍 Services without prices:');
    serviceIds.forEach(serviceId => {
      if (!priceServiceIds[serviceId]) {
        console.log(`❌ Service "${serviceId}" has no prices in Google Sheets`);
      }
    });
    
    console.log('\n✅ Debug completed!');
    
  } catch (error) {
    console.error('❌ Error debugging service IDs:', error);
  }
}

debugServiceIds();