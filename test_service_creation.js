import GoogleSheetsService from './server/src/services/googleSheetsService.js';

async function testServiceCreation() {
  try {
    console.log('🧪 Testing service creation with prices...');
    
    // Initialize Google Sheets
    await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets initialized');
    
    // Check current Vehicle_Service_Prices data
    console.log('\n📊 Current Vehicle_Service_Prices data:');
    const currentPrices = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    console.log(`Found ${currentPrices.length - 1} price entries`);
    
    if (currentPrices.length > 1) {
      console.log('Headers:', currentPrices[0]);
      console.log('First 3 price entries:', currentPrices.slice(1, 4));
    }
    
    // Check current Vehicle_Services data
    console.log('\n📋 Current Vehicle_Services data:');
    const currentServices = await GoogleSheetsService.getData('Vehicle_Services');
    console.log(`Found ${currentServices.length - 1} services`);
    
    if (currentServices.length > 1) {
      console.log('Headers:', currentServices[0]);
      console.log('Last 3 services:', currentServices.slice(-3));
    }
    
    // Find the most recent service
    const lastService = currentServices[currentServices.length - 1];
    if (lastService) {
      console.log('\n🔍 Checking prices for most recent service:', lastService[0]);
      const servicePrices = currentPrices.filter(row => row[1] === lastService[0]);
      console.log(`Found ${servicePrices.length} prices for this service`);
      if (servicePrices.length > 0) {
        console.log('Service prices:', servicePrices);
      }
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testServiceCreation();