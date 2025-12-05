const GoogleSheetsService = require('./server/src/services/googleSheetsService.js').default;

async function testSheetsStructure() {
  try {
    console.log('📊 Testing Google Sheets structure...');
    
    // Test Vehicle_Services sheet
    console.log('\n📋 Vehicle_Services sheet:');
    const servicesData = await GoogleSheetsService.getData('Vehicle_Services');
    if (servicesData.length > 0) {
      console.log('Headers:', servicesData[0]);
      console.log('First row:', servicesData[1] || 'No data');
      console.log('Total rows:', servicesData.length - 1);
    } else {
      console.log('No data in Vehicle_Services');
    }
    
    // Test Vehicle_Service_Prices sheet
    console.log('\n💰 Vehicle_Service_Prices sheet:');
    const pricesData = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    if (pricesData.length > 0) {
      console.log('Headers:', pricesData[0]);
      console.log('First row:', pricesData[1] || 'No data');
      console.log('Total rows:', pricesData.length - 1);
    } else {
      console.log('No data in Vehicle_Service_Prices');
    }
    
    // Test getServicesWithPrices
    console.log('\n🚗 Testing getServicesWithPrices...');
    const servicesWithPrices = await GoogleSheetsService.getServicesWithPrices();
    console.log(`Found ${servicesWithPrices.length} services`);
    if (servicesWithPrices.length > 0) {
      console.log('First service:', JSON.stringify(servicesWithPrices[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSheetsStructure();