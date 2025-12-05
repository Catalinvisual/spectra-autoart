const GoogleSheetsService = require('./server/src/services/googleSheetsService.js').default;

async function debugServicesAndPrices() {
  try {
    console.log('🔍 Debugging services and prices data...');
    
    // Get services data
    const servicesData = await GoogleSheetsService.getData('Vehicle_Services');
    console.log('\n📋 Services Data:');
    console.log('Total services rows:', servicesData.length);
    
    if (servicesData.length > 1) {
      const headers = servicesData[0];
      const idIndex = headers.indexOf('ID');
      const nameIndex = headers.indexOf('Name_EN');
      const isActiveIndex = headers.indexOf('Is_Active');
      
      console.log('Services headers:', headers);
      console.log('ID column index:', idIndex);
      console.log('Name_EN column index:', nameIndex);
      console.log('Is_Active column index:', isActiveIndex);
      
      console.log('\n📊 Service entries:');
      servicesData.slice(1).forEach((row, index) => {
        const id = row[idIndex];
        const name = row[nameIndex];
        const isActive = row[isActiveIndex];
        console.log(`Service ${index + 1}: ID="${id}", Name="${name}", Is_Active="${isActive}"`);
      });
    }
    
    // Get prices data
    const pricesData = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    console.log('\n💰 Prices Data:');
    console.log('Total prices rows:', pricesData.length);
    
    if (pricesData.length > 1) {
      const headers = pricesData[0];
      const idIndex = headers.indexOf('ID');
      const serviceIdIndex = headers.indexOf('Service_ID');
      const bodyTypeIndex = headers.indexOf('Body_Type_ID');
      const priceMinIndex = headers.indexOf('Price_Min');
      const isActiveIndex = headers.indexOf('Is_Active');
      
      console.log('Prices headers:', headers);
      console.log('ID column index:', idIndex);
      console.log('Service_ID column index:', serviceIdIndex);
      console.log('Body_Type_ID column index:', bodyTypeIndex);
      console.log('Price_Min column index:', priceMinIndex);
      console.log('Is_Active column index:', isActiveIndex);
      
      console.log('\n📊 First 5 price entries:');
      pricesData.slice(1, 6).forEach((row, index) => {
        const id = row[idIndex];
        const serviceId = row[serviceIdIndex];
        const bodyType = row[bodyTypeIndex];
        const priceMin = row[priceMinIndex];
        const isActive = row[isActiveIndex];
        console.log(`Price ${index + 1}: ID="${id}", Service_ID="${serviceId}", Body_Type_ID="${bodyType}", Price_Min="${priceMin}", Is_Active="${isActive}"`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugServicesAndPrices();