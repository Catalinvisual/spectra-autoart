const GoogleSheetsService = require('./server/src/services/googleSheetsService');

async function debugServiceIds() {
  try {
    console.log('🔍 Debugging Service IDs...\n');
    
    // Get services
    const services = await GoogleSheetsService.getData('Vehicle_Services');
    console.log('📋 Services found:', services.length);
    
    if (services.length > 1) {
      console.log('\n📝 Service IDs:');
      services.slice(1).forEach((service, index) => {
        console.log(`  ${index + 1}. ID: "${service[0]}" | Name: "${service[1]}"`);
      });
    }
    
    // Get prices
    const prices = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    console.log('\n💰 Prices found:', prices.length);
    
    if (prices.length > 1) {
      console.log('\n💵 Price Service_IDs (first 10):');
      prices.slice(1, 11).forEach((price, index) => {
        console.log(`  ${index + 1}. Service_ID: "${price[1]}" | Body Type: "${price[2]}" | Price: "${price[3]}"`);
      });
      
      if (prices.length > 11) {
        console.log(`  ... and ${prices.length - 11} more prices`);
      }
    }
    
    // Check for matches
    if (services.length > 1 && prices.length > 1) {
      const serviceIds = services.slice(1).map(s => s[0]);
      const priceServiceIds = prices.slice(1).map(p => p[1]);
      
      console.log('\n🔗 Checking for matches:');
      serviceIds.forEach(serviceId => {
        const matchingPrices = priceServiceIds.filter(priceId => priceId === serviceId);
        console.log(`  Service ID "${serviceId}": ${matchingPrices.length} matching prices`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error debugging service IDs:', error.message);
  }
}

debugServiceIds();