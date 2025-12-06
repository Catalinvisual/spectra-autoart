import { GoogleSheetsService } from './src/services/googleSheetsService.js';

async function checkGoogleSheetsData() {
  console.log('🔍 Checking Google Sheets data...');
  
  const sheetsService = new GoogleSheetsService();
  
  try {
    await sheetsService.initialize();
    
    // Verificăm serviciul creat recent
    const services = await sheetsService.getData('Vehicle_Services');
    console.log(`📊 Found ${services.length} services in Vehicle_Services`);
    
    // Găsim ultimul serviciu adăugat
    const lastService = services[services.length - 1];
    if (lastService) {
      console.log('🆔 Last service:', {
        id: lastService.id,
        name: lastService.name,
        slug: lastService.slug
      });
    }
    
    // Verificăm prețurile
    const prices = await sheetsService.getData('Vehicle_Service_Prices');
    console.log(`💰 Found ${prices.length} prices in Vehicle_Service_Prices`);
    
    // Găsim prețurile pentru ultimul serviciu
    if (lastService) {
      const servicePrices = prices.filter(price => price.service_id == lastService.id);
      console.log(`💰 Found ${servicePrices.length} prices for service ${lastService.id}`);
      
      if (servicePrices.length > 0) {
        console.log('✅ Prices saved successfully in Google Sheets!');
        servicePrices.forEach(price => {
          console.log(`  - ${price.body_type_key}: €${price.price_min} (${price.duration_minutes} min)`);
        });
      } else {
        console.log('❌ No prices found for this service in Google Sheets');
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking Google Sheets:', error.message);
  }
}

checkGoogleSheetsData();