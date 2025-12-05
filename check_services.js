import GoogleSheetsService from './server/src/services/googleSheetsService.js';

async function checkServices() {
  try {
    console.log('Initializing Google Sheets service...');
    await GoogleSheetsService.initialize();
    
    console.log('\nFetching Vehicle_Services data...');
    const servicesData = await GoogleSheetsService.getData('Vehicle_Services');
    
    console.log('Service Headers:', servicesData[0]);
    console.log('Total service rows:', servicesData.length - 1);
    
    if (servicesData.length > 1) {
      console.log('\nAll service rows:');
      servicesData.slice(1).forEach((row, i) => {
        console.log(`Service ${i+1}: ID=${row[0]}, Name=${row[1]}, Active=${row[21]}`);
      });
    }
    
    console.log('\nFetching Vehicle_Service_Prices data...');
    const pricesData = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    
    console.log('Total price rows:', pricesData.length - 1);
    
    if (pricesData.length > 1) {
      console.log('\nAll price rows:');
      pricesData.slice(1).forEach((row, i) => {
        console.log(`Price ${i+1}: Service_ID=${row[1]}, Body_Type=${row[2]}, Price_Min=${row[3]}, Active=${row[8]}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkServices();