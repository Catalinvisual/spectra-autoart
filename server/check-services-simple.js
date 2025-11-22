import GoogleSheetsService from './src/services/googleSheetsService.js';

async function checkServices() {
  try {
    await GoogleSheetsService.initialize();
    const servicesData = await GoogleSheetsService.getData('Services');
    console.log('Services sheet data:');
    if (servicesData.length > 0) {
      console.log('Headers:', servicesData[0]);
      console.log('First few rows:');
      servicesData.slice(1, 5).forEach((row, index) => {
        console.log(`Row ${index + 1}: ID=${row[0]}, Name=${row[1]}`);
      });
      
      // Look for the specific service ID
      const targetService = servicesData.slice(1).find(row => row[0] === '1763455238065');
      if (targetService) {
        console.log('Found target service:', targetService);
      } else {
        console.log('Service 1763455238065 not found in Services sheet');
        console.log('Available service IDs:', servicesData.slice(1).map(row => row[0]));
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkServices();