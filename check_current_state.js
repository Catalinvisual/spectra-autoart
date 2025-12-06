import GoogleSheetsService from './server/src/services/googleSheetsService.js';

async function checkCurrentState() {
  try {
    console.log('🔍 Checking current Google Sheets state...');
    
    // Initialize Google Sheets
    await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets initialized');
    
    // Check current Vehicle_Service_Prices data
    console.log('\n📊 Current Vehicle_Service_Prices data:');
    const currentPrices = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    console.log(`Found ${currentPrices.length - 1} price entries`);
    
    if (currentPrices.length > 1) {
      console.log('Headers:', currentPrices[0]);
      console.log('Last 5 price entries:', currentPrices.slice(-5));
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
      } else {
        console.log('❌ No prices found for this service in Google Sheets!');
      }
    }
    
    console.log('\n✅ Check completed!');
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

checkCurrentState();