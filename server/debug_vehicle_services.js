import dotenv from 'dotenv'
import { GoogleSheetsService } from './src/services/googleSheetsService.js';

// Load environment variables
dotenv.config({ path: '.env.local' })

async function debugVehicleServices() {
  console.log('=== DEBUG VEHICLE SERVICES ===');
  const service = new GoogleSheetsService();
  try {
    console.log('Initializing service...');
    await service.initialize();
    
    console.log('\n=== VEHICLE SERVICES DATA ===');
    const servicesData = await service.getData('Vehicle_Services');
    console.log(`Vehicle_Services sheet: ${servicesData.length} rows, ${servicesData[0]?.length} columns`);
    
    if (servicesData.length > 0) {
      console.log('Headers:', servicesData[0]);
      console.log('\nService rows:');
      servicesData.slice(1).forEach((row, index) => {
        console.log(`Row ${index + 1}: ID='${row[0]}' | Name='${row[1]}' | Is_Active='${row[20]}'`);
      });
    }
    
    console.log('\n=== VEHICLE SERVICE PRICES DATA ===');
    const pricesData = await service.getData('Vehicle_Service_Prices');
    console.log(`Vehicle_Service_Prices sheet: ${pricesData.length} rows, ${pricesData[0]?.length} columns`);
    
    if (pricesData.length > 0) {
      console.log('Headers:', pricesData[0]);
      console.log('\nPrice rows:');
      pricesData.slice(1).forEach((row, index) => {
        console.log(`Row ${index + 1}: ID='${row[0]}' | Service_ID='${row[1]}' | Body_Type='${row[2]}' | Price_Min='${row[3]}' | Is_Active='${row[7]}'`);
      });
    }
    
    // Verificăm match-urile
    console.log('\n=== MATCHING ANALYSIS ===');
    const serviceIds = servicesData.slice(1).map(row => String(row[0] || '').trim());
    const priceServiceIds = pricesData.slice(1).map(row => String(row[1] || '').trim());
    
    console.log('Service IDs from Vehicle_Services:', serviceIds);
    console.log('Service IDs from Vehicle_Service_Prices:', [...new Set(priceServiceIds)]);
    
    // Verificăm match-urile
    servicesData.slice(1).forEach(serviceRow => {
      const serviceId = String(serviceRow[0] || '').trim();
      const matchingPrices = pricesData.slice(1).filter(priceRow => String(priceRow[1] || '').trim() === serviceId);
      console.log(`Service '${serviceId}' has ${matchingPrices.length} matching prices`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugVehicleServices();