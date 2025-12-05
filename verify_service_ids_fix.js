// Script to verify that the Service_ID fix worked
async function verifyServiceIdsFix() {
  try {
    console.log('🔍 Verifying Service_ID fix...');
    
    // Test the current state
    const response = await fetch('http://localhost:8080/api/admin/test-sheets-structure');
    const data = await response.json();
    
    console.log('\n📊 Current State:');
    console.log(`- Services count: ${data.data.servicesCount}`);
    console.log(`- Prices count: ${data.data.pricesCount}`);
    console.log(`- Services with prices count: ${data.data.servicesWithPricesCount}`);
    
    if (data.data.servicesWithPricesCount > 0) {
      console.log('\n✅ SUCCESS! Services and prices are now linked correctly!');
      console.log('🎯 The service editing functionality should now show the saved prices.');
    } else {
      console.log('\n❌ Still no services linked to prices.');
      console.log('📝 Please ensure you updated the Service_ID column in the Google Sheet.');
      console.log('💡 The Service_ID in prices should match the ID in services.');
    }
    
    // Show sample data for verification
    if (data.data.sampleServicesWithPrices && data.data.sampleServicesWithPrices.length > 0) {
      console.log('\n📋 Sample linked services:');
      data.data.sampleServicesWithPrices.slice(0, 2).forEach(service => {
        console.log(`- Service: ${service.name} (${service.id})`);
        console.log(`  Prices: ${service.prices ? service.prices.length : 0}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error verifying fix:', error.message);
  }
}

verifyServiceIdsFix();