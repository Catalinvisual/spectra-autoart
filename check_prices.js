import GoogleSheetsService from './server/src/services/googleSheetsService.js';

async function checkPrices() {
  try {
    console.log('Initializing Google Sheets service...');
    await GoogleSheetsService.initialize();
    
    console.log('\nFetching Vehicle_Service_Prices data...');
    const pricesData = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    
    console.log('Headers:', pricesData[0]);
    console.log('Total rows:', pricesData.length - 1);
    
    if (pricesData.length > 1) {
      console.log('\nFirst 5 price rows:');
      pricesData.slice(1, 6).forEach((row, i) => {
        console.log(`Row ${i+1}:`, row);
      });
    } else {
      console.log('No price data found!');
    }
    
    console.log('\nFetching Vehicle_Services data...');
    const servicesData = await GoogleSheetsService.getData('Vehicle_Services');
    
    console.log('Service Headers:', servicesData[0]);
    console.log('Total service rows:', servicesData.length - 1);
    
    if (servicesData.length > 1) {
      console.log('\nFirst 3 service rows:');
      servicesData.slice(1, 4).forEach((row, i) => {
        console.log(`Service ${i+1}:`, row);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkPrices();