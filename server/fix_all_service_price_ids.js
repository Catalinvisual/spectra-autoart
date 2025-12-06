import dotenv from 'dotenv'
import { GoogleSheetsService } from './src/services/googleSheetsService.js';

// Load environment variables
dotenv.config({ path: '.env.local' })

async function fixAllServicePriceIDs() {
  console.log('=== FIXING ALL SERVICE PRICE IDs ===');
  const service = new GoogleSheetsService();
  try {
    console.log('Initializing service...');
    await service.initialize();
    
    console.log('\n=== GETTING CURRENT DATA ===');
    const servicesData = await service.getData('Vehicle_Services');
    const pricesData = await service.getData('Vehicle_Service_Prices');
    
    console.log(`Found ${servicesData.length - 1} services and ${pricesData.length - 1} prices`);
    
    // Găsim primul serviciu (cel cu ID vechi service_1)
    const firstService = servicesData.slice(1).find(row => row[0] && row[0].includes('service-'));
    if (!firstService) {
      console.log('❌ No service found with new ID format');
      return;
    }
    
    const targetServiceId = firstService[0]; // ID-ul serviciului principal
    console.log(`Target service ID: ${targetServiceId}`);
    
    console.log('\n=== UPDATING ALL PRICE IDs TO TARGET SERVICE ===');
    let updatedCount = 0;
    
    // Parcurg toate prețurile și le actualizez la serviciul țintă
    for (let i = 1; i < pricesData.length; i++) {
      const priceRow = pricesData[i];
      const currentServiceId = String(priceRow[1] || '').trim();
      
      // Actualizez TOATE prețurile, indiferent de ID-ul curent
      console.log(`Updating row ${i + 1}: Service_ID from "${currentServiceId}" to "${targetServiceId}"`);
      
      // Actualizez doar Service_ID (coloana 2, index 1)
      const updatedRow = [...priceRow];
      updatedRow[1] = targetServiceId;
      
      // Actualizez în Google Sheets
      await service.updateData('Vehicle_Service_Prices', i + 1, updatedRow);
      updatedCount++;
    }
    
    console.log(`\n✅ Updated ${updatedCount} price rows`);
    
    // Verific actualizările
    console.log('\n=== VERIFICATION ===');
    const updatedPricesData = await service.getData('Vehicle_Service_Prices');
    const verification = {};
    
    updatedPricesData.slice(1).forEach(row => {
      const serviceId = String(row[1] || '').trim();
      if (serviceId) {
        verification[serviceId] = (verification[serviceId] || 0) + 1;
      }
    });
    
    console.log('Service IDs in prices after update:');
    Object.entries(verification).forEach(([serviceId, count]) => {
      console.log(`- ${serviceId}: ${count} prices`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixAllServicePriceIDs();