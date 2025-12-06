import GoogleSheetsService from './src/services/googleSheetsService.js';

async function checkPricesForService(serviceId) {
  try {
    console.log(`🔍 Checking Google Sheets for prices of service: ${serviceId}`);
    
    // Initialize Google Sheets
    await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets initialized');
    
    // Check Vehicle_Service_Prices for this service
    const prices = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    console.log(`📊 Total prices in sheet: ${prices.length - 1}`);
    
    const servicePrices = prices.filter(row => row[1] === serviceId.toString());
    console.log(`🔍 Found ${servicePrices.length} prices for service ${serviceId}:`);
    
    if (servicePrices.length > 0) {
      servicePrices.forEach((price, index) => {
        console.log(`  ${index + 1}. ${price[2]}: ${price[3]} ${price[4]} (${price[5]} min) - ID: ${price[0]}`);
      });
      console.log('✅ Prices successfully saved to Google Sheets!');
      return true;
    } else {
      console.log('❌ No prices found in Google Sheets for this service');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Failed to check Google Sheets:', error.message);
    return false;
  }
}

// Check the service we just created
const serviceId = 'service-1765031641956-765';
checkPricesForService(serviceId);