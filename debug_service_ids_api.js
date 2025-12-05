async function debugServiceIds() {
  try {
    console.log('🔍 Debugging Service IDs via API...\n');
    
    // Get data from test endpoint
    const response = await fetch('http://localhost:8080/api/admin/test-sheets-structure');
    const data = await response.json();
    
    console.log('📊 Basic Stats:');
    console.log(`- Services: ${data.data.servicesCount}`);
    console.log(`- Prices: ${data.data.pricesCount}`);
    console.log(`- Services with prices: ${data.data.servicesWithPricesCount}`);
    
    // Check sample services
    if (data.data.sampleServices && data.data.sampleServices.length > 0) {
      console.log('\n📝 Sample Services (first 3):');
      data.data.sampleServices.forEach((service, index) => {
        console.log(`  ${index + 1}. ID: "${service[0]}" | Name: "${service[1]}"`);
      });
    }
    
    // Check sample prices
    if (data.data.samplePrices && data.data.samplePrices.length > 0) {
      console.log('\n💵 Sample Prices (first 5):');
      data.data.samplePrices.forEach((price, index) => {
        console.log(`  ${index + 1}. Service_ID: "${price[1]}" | Body Type: "${price[2]}" | Price: "${price[3]}"`);
      });
    }
    
    // Manual check for matches
    if (data.data.sampleServices && data.data.samplePrices) {
      const serviceIds = data.data.sampleServices.map(s => s[0]);
      const priceServiceIds = data.data.samplePrices.map(p => p[1]);
      
      console.log('\n🔗 Checking for matches in sample data:');
      serviceIds.forEach(serviceId => {
        const matchingPrices = priceServiceIds.filter(priceId => priceId === serviceId);
        console.log(`  Service ID "${serviceId}": ${matchingPrices.length} matching prices in sample`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error debugging service IDs:', error.message);
  }
}

debugServiceIds();