import { vehicleServicesService } from './src/services/vehicleServicesService.js';

async function debugServices() {
  console.log('🚀 Starting debug...');
  
  try {
    // Încarcă demo data în loc de Google Sheets
    console.log('📥 Loading demo data...');
    await vehicleServicesService.initializeDemoData();
    
    console.log('📋 Services loaded:', vehicleServicesService.services.length);
    console.log('💰 Service prices loaded:', vehicleServicesService.servicePrices.length);
    console.log('🚗 Body types loaded:', vehicleServicesService.bodyTypes.length);
    
    // Afișează toate serviciile
    console.log('\n🔍 All services:');
    vehicleServicesService.services.forEach(service => {
      console.log(`- ${service.name} (ID: ${service.id}, Slug: ${service.slug})`);
    });
    
    // Afișează toate prețurile
    console.log('\n🔍 All service prices:');
    vehicleServicesService.servicePrices.forEach(price => {
      console.log(`- Service ID: ${price.service_id}, Body Type ID: ${price.body_type_id} (${typeof price.body_type_id}), Price: ${price.price_min}`);
    });
    
    // Afișează toate tipurile de caroserie
    console.log('\n🔍 All body types:');
    vehicleServicesService.bodyTypes.forEach(bt => {
      console.log(`- ${bt.name} (ID: ${bt.id} (${typeof bt.id}), Key: ${bt.key})`);
    });
    
    // Test pentru SUV
    console.log('\n🚗 Testing SUV body type:');
    const suvBodyType = vehicleServicesService.bodyTypes.find(bt => bt.key === 'suv');
    if (suvBodyType) {
      console.log(`- SUV body type found: ID=${suvBodyType.id} (type: ${typeof suvBodyType.id})`);
      
      // Caută prețuri pentru SUV
      const suvPrices = vehicleServicesService.servicePrices.filter(
        price => price.body_type_id === suvBodyType.id
      );
      console.log(`- Found ${suvPrices.length} prices for SUV body type ID ${suvBodyType.id} (number)`);
      
      // Caută și cu string
      const suvPricesString = vehicleServicesService.servicePrices.filter(
        price => price.body_type_id === String(suvBodyType.id)
      );
      console.log(`- Found ${suvPricesString.length} prices for SUV body type ID ${String(suvBodyType.id)} (string)`);
      
      // Test getServicesByBodyType
      const servicesByBodyType = vehicleServicesService.getServicesByBodyType('suv');
      console.log(`- getServicesByBodyType('suv') returned ${servicesByBodyType.length} services`);
      
      if (servicesByBodyType.length > 0) {
        console.log(`- First service: ${servicesByBodyType[0].name}, prices: ${servicesByBodyType[0].prices?.length || 0}`);
        if (servicesByBodyType[0].prices && servicesByBodyType[0].prices.length > 0) {
          console.log(`- First price: ${servicesByBodyType[0].prices[0].price_min} EUR`);
        }
      }
      
      // Test pentru Premium Wash specific
      console.log('\n🧼 Testing Premium Wash for SUV:');
      const premiumWash = vehicleServicesService.services.find(s => s.slug === 'premium-wash');
      if (premiumWash) {
        console.log(`- Premium Wash found: ID=${premiumWash.id}`);
        const premiumSuvPrice = vehicleServicesService.servicePrices.find(
          p => p.service_id === premiumWash.id && p.body_type_id === suvBodyType.id
        );
        if (premiumSuvPrice) {
          console.log(`- Premium Wash for SUV: ${premiumSuvPrice.price_min} EUR`);
        } else {
          console.log(`- Premium Wash for SUV: No price found`);
        }
        
        // Test și cu string
        const premiumSuvPriceString = vehicleServicesService.servicePrices.find(
          p => p.service_id === premiumWash.id && p.body_type_id === String(suvBodyType.id)
        );
        if (premiumSuvPriceString) {
          console.log(`- Premium Wash for SUV (string): ${premiumSuvPriceString.price_min} EUR`);
        } else {
          console.log(`- Premium Wash for SUV (string): No price found`);
        }
      }
    } else {
      console.log('- SUV body type not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugServices();