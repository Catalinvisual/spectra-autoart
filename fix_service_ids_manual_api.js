async function fixServiceIdsViaAPI() {
  try {
    console.log('🔄 Fixing Service ID mismatch via API...\n');
    
    // Get current data from API
    const response = await fetch('http://localhost:8080/api/admin/test-sheets-structure');
    const data = await response.json();
    
    console.log('📊 Current State:');
    console.log(`- Services: ${data.data.servicesCount}`);
    console.log(`- Prices: ${data.data.pricesCount}`);
    console.log(`- Services with prices: ${data.data.servicesWithPricesCount}`);
    
    // Extract service IDs and create mapping
    const services = data.data.sampleServices;
    const prices = data.data.samplePrices;
    
    if (services.length === 0 || prices.length === 0) {
      console.log('❌ No data to fix');
      return;
    }
    
    console.log('\n📝 Service IDs found:');
    services.forEach((service, index) => {
      console.log(`  ${index + 1}. "${service[0]}" - "${service[1]}"`);
    });
    
    console.log('\n💵 Price Service_IDs found:');
    prices.forEach((price, index) => {
      console.log(`  ${index + 1}. "${price[1]}" - Body Type: "${price[2]}" - Price: "${price[3]}"`);
    });
    
    // Create manual fix instructions
    console.log('\n📝 Manual Fix Instructions:');
    console.log('1. Open Google Sheets');
    console.log('2. Go to "Vehicle_Service_Prices" sheet');
    console.log('3. Update Service_ID column:');
    
    if (services.length > 0) {
      const firstServiceId = services[0][0];
      console.log(`   - Change all "1" to "${firstServiceId}"`);
      
      if (services.length > 1) {
        console.log('   - For other services, map as follows:');
        services.forEach((service, index) => {
          console.log(`     * Service "${service[1]}" → ID "${service[0]}"`);
        });
      }
    }
    
    console.log('\n✅ After manual fix, services and prices should be linked correctly!');
    console.log('🎯 Test by editing a service - saved prices should now appear for each body type.');
    
  } catch (error) {
    console.error('❌ Error fixing service IDs:', error.message);
  }
}

fixServiceIdsViaAPI();