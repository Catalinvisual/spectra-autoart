import { vehicleServicesService } from './src/services/vehicleServicesService.js';

// Test the mapping logic for your specific case
async function testMapping() {
  console.log('🧪 Testing body type mapping...');
  
  // Your input prices
  const inputPrices = {
    sedan: { price_min: 11, price_max: null, duration_minutes: 60 },
    suv: { price_min: 22, price_max: null, duration_minutes: 60 },
    hatchback: { price_min: 33, price_max: null, duration_minutes: 60 },
    cabrio: { price_min: 44, price_max: null, duration_minutes: 60 },
    coupe: { price_min: 55, price_max: null, duration_minutes: 60 },
    wagon: { price_min: 66, price_max: null, duration_minutes: 60 },
    van: { price_min: 77, price_max: null, duration_minutes: 60 },
    break: { price_min: 88, price_max: null, duration_minutes: 60 }
  };
  
  console.log('📋 Input prices:', JSON.stringify(inputPrices, null, 2));
  
  // Test mapping for each key
  Object.keys(inputPrices).forEach(key => {
    console.log(`\n🔄 Testing key: "${key}"`);
    const mapped = vehicleServicesService.mapFrontendKeyToBodyType(key);
    if (mapped) {
      console.log(`✅ Mapped to: ${mapped.key} (ID: ${mapped.id}, Name: ${mapped.name})`);
    } else {
      console.log(`❌ No mapping found for: ${key}`);
    }
  });
  
  // Test the actual price processing logic
  console.log('\n💰 Testing price processing logic...');
  
  const activeBodyTypes = vehicleServicesService.bodyTypes.filter(bt => bt.is_active);
  console.log(`📊 Active body types: ${activeBodyTypes.length}`);
  activeBodyTypes.forEach(bt => {
    console.log(`  - ${bt.key} (ID: ${bt.id}, Name: ${bt.name})`);
  });
  
  // Simulate the mapping logic from addServiceWithPrices
  const frontendToBodyType = {};
  Object.keys(inputPrices).forEach(frontendKey => {
    const mappedBodyType = vehicleServicesService.mapFrontendKeyToBodyType(frontendKey);
    if (mappedBodyType) {
      frontendToBodyType[mappedBodyType.key] = {
        frontendKey: frontendKey,
        price: inputPrices[frontendKey]
      };
    }
  });
  
  console.log('\n🗺️ Frontend to BodyType mapping result:');
  console.log(JSON.stringify(frontendToBodyType, null, 2));
  
  // Show what prices would be created
  console.log('\n💵 Prices that would be created:');
  activeBodyTypes.forEach((bodyType, index) => {
    const mapping = frontendToBodyType[bodyType.key];
    const providedPrice = mapping ? mapping.price : null;
    
    if (providedPrice) {
      console.log(`✅ ${bodyType.key}: €${providedPrice.price_min} (from frontend key: ${mapping.frontendKey})`);
    } else {
      console.log(`⚠️  ${bodyType.key}: No price provided - would use default €50`);
    }
  });
}

testMapping().catch(console.error);