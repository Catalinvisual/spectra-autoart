// Test script pentru a verifica mapping-ul dintre frontend keys și body types
import { vehicleServicesService } from './server/src/services/vehicleServicesService.js';

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

console.log('🧪 Testing body type mapping and price processing...\n');

// Available body types
const activeBodyTypes = vehicleServicesService.bodyTypes.filter(bt => bt.is_active);
console.log('📋 Available body types:', activeBodyTypes.map(bt => ({id: bt.id, key: bt.key, name: bt.name})));

// Test individual mappings
console.log('\n🔍 Testing individual mappings:');
Object.keys(inputPrices).forEach(frontendKey => {
  const mapped = vehicleServicesService.mapFrontendKeyToBodyType(frontendKey);
  if (mapped) {
    console.log(`   ${frontendKey} -> ${mapped.key} (ID: ${mapped.id}, Name: ${mapped.name})`);
  } else {
    console.log(`   ${frontendKey} -> ❌ NOT MAPPED`);
  }
});

// Map frontend keys to body types for quick lookup
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

console.log('\n🗺️ Frontend to BodyType mapping:', frontendToBodyType);

// Simulate the price processing logic from addServiceWithPrices
const newServiceId = 12345; // Example ID
const newPrices = [];

console.log('\n💰 Processing prices for each body type:');

for (let index = 0; index < activeBodyTypes.length; index++) {
  const bodyType = activeBodyTypes[index];
  const mapping = frontendToBodyType[bodyType.key];
  const providedPrice = mapping ? mapping.price : null;
  const frontendKeyUsed = mapping ? mapping.frontendKey : null;
  
  console.log(`\n🔍 BodyType ${bodyType.key} (ID: ${bodyType.id}):`);
  console.log(`   Frontend key used: ${frontendKeyUsed}`);
  console.log(`   Provided price:`, providedPrice);
  
  let priceData;
  if (providedPrice !== null) {
    // Folosește prețurile furnizate din frontend
    if (typeof providedPrice === 'object') {
      // Dacă este obiect cu price_min, price_max, etc.
      priceData = {
        price_min: providedPrice.price_min || 50,
        price_max: providedPrice.price_max !== undefined ? providedPrice.price_max : null,
        duration_minutes: providedPrice.duration_minutes || 60
      };
    } else if (typeof providedPrice === 'number') {
      // Dacă este doar un număr (preț simplu)
      priceData = {
        price_min: providedPrice,
        price_max: null,
        duration_minutes: 60
      };
    }
  } else {
    // Folosește valori implicite
    console.log(`   ⚠️  No price provided for ${bodyType.key}, using defaults`);
    priceData = {
      price_min: 50,
      price_max: null,
      duration_minutes: 60
    };
  }
  
  console.log(`   Final price data:`, priceData);
  
  const newPrice = {
    id: newServiceId * 100 + index,
    service_id: Number(newServiceId),
    body_type_id: bodyType.id,
    body_type_key: bodyType.key,
    price_min: priceData.price_min,
    price_max: priceData.price_max,
    currency: 'EUR',
    duration_minutes: priceData.duration_minutes,
    promo_percent: 0,
    is_active: true
  };
  
  newPrices.push(newPrice);
}

console.log('\n📊 Final processed prices:');
newPrices.forEach(price => {
  console.log(`   ${price.body_type_key}: €${price.price_min} (ID: ${price.id})`);
});

console.log('\n✅ Test completed!');
console.log(`Total body types processed: ${activeBodyTypes.length}`);
console.log(`Total prices created: ${newPrices.length}`);