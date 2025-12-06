import { vehicleServicesService } from './src/services/vehicleServicesService.js';

async function testPriceMapping() {
  console.log('🧪 Testing price mapping directly...');
  
  try {
    const result = await vehicleServicesService.addServiceWithPrices({
      name: 'Test Service Direct',
      description: 'Testing price mapping directly'
    }, {
      sedan: 150,
      suv: 200,
      hatchback: 180
    });
    
    console.log('✅ Service created with prices:', result);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPriceMapping();