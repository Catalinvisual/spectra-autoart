import dotenv from 'dotenv'
import { GoogleSheetsService } from './src/services/googleSheetsService.js';

// Load environment variables
dotenv.config({ path: '.env.local' })

async function fixServicePriceIDs() {
  console.log('=== FIXING SERVICE PRICE IDs ===');
  const service = new GoogleSheetsService();
  try {
    console.log('Initializing service...');
    await service.initialize();
    
    console.log('\n=== GETTING CURRENT DATA ===');
    const servicesData = await service.getData('Vehicle_Services');
    const pricesData = await service.getData('Vehicle_Service_Prices');
    
    console.log(`Found ${servicesData.length - 1} services and ${pricesData.length - 1} prices`);
    
    // Creez o mapare de la ID-uri vechi la noi
    const serviceMapping = {};
    servicesData.slice(1).forEach((row, index) => {
      const newId = row[0]; // ID-ul actual din Vehicle_Services
      const oldId = `service_${index + 1}`; // ID-ul vechi folosit în prețuri
      if (newId && oldId) {
        serviceMapping[oldId] = newId;
        console.log(`Mapping: ${oldId} -> ${newId}`);
      }
    });
    
    console.log('\n=== UPDATING PRICE IDs ===');
    let updatedCount = 0;
    
    // Parcurg toate prețurile și le actualizez
    for (let i = 1; i < pricesData.length; i++) {
      const priceRow = pricesData[i];
      const currentServiceId = String(priceRow[1] || '').trim();
      const newServiceId = serviceMapping[currentServiceId];
      
      if (newServiceId && newServiceId !== currentServiceId) {
        console.log(`Updating row ${i + 1}: Service_ID from "${currentServiceId}" to "${newServiceId}"`);
        
        // Actualizez doar Service_ID (coloana 2, index 1)
        const updatedRow = [...priceRow];
        updatedRow[1] = newServiceId;
        
        // Actualizez în Google Sheets (indexul începe de la 1, deci adaug 1)
        await service.updateData('Vehicle_Service_Prices', i + 1, updatedRow);
        updatedCount++;
      }
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

fixServicePriceIDs();