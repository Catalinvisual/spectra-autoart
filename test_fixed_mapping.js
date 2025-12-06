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

console.log('🧪 Testing FIXED body type mapping and price processing...\n');

// Available body types
const activeBodyTypes = vehicleServicesService.bodyTypes.filter(bt => bt.is_active);
console.log('📋 Available body types:', activeBodyTypes.map(bt => ({id: bt.id, key: bt.key, name: bt.name})));

// Simulate the FIXED price processing logic
const newServiceId = 12345; // Example ID
const newPrices = [];

console.log('\n💰 Processing prices for each body type with FIXED logic:');

for (let index = 0; index < activeBodyTypes.length; index++) {
  const bodyType = activeBodyTypes[index];
  let providedPrice = null;
  let frontendKeyUsed = null;
  
  // Caută prețul pentru acest body type în prețurile furnizate (LOGICA CORECTATĂ)
  for (const [frontendKey, priceData] of Object.entries(inputPrices)) {
    const mappedBodyType = vehicleServicesService.mapFrontendKeyToBodyType(frontendKey);
    if (mappedBodyType && mappedBodyType.key === bodyType.key) {
      providedPrice = priceData;
      frontendKeyUsed = frontendKey;
      break; // Găsit, nu mai căuta
    }
  }
  
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

console.log('\n📊 Final processed prices with FIXED logic:');
newPrices.forEach(price => {
  console.log(`   ${price.body_type_key}: €${price.price_min} (ID: ${price.id})`);
});

console.log('\n✅ Test completed with FIXED logic!');
console.log(`Total body types processed: ${activeBodyTypes.length}`);
console.log(`Total prices created: ${newPrices.length}`);

// Check for conflicts
const conflicts = [];
const processedBodyTypes = {};

Object.keys(inputPrices).forEach(frontendKey => {
  const mappedBodyType = vehicleServicesService.mapFrontendKeyToBodyType(frontendKey);
  if (mappedBodyType) {
    if (processedBodyTypes[mappedBodyType.key]) {
      conflicts.push({
        bodyTypeKey: mappedBodyType.key,
        frontendKey1: processedBodyTypes[mappedBodyType.key],
        frontendKey2: frontendKey,
        price1: inputPrices[processedBodyTypes[mappedBodyType.key]],
        price2: inputPrices[frontendKey]
      });
    } else {
      processedBodyTypes[mappedBodyType.key] = frontendKey;
    }
  }
});

if (conflicts.length > 0) {
  console.log('\n⚠️  Conflicts detected (multiple frontend keys map to same body type):');
  conflicts.forEach(conflict => {
    console.log(`   Body type '${conflict.bodyTypeKey}':`);
    console.log(`     ${conflict.frontendKey1}: €${conflict.price1.price_min}`);
    console.log(`     ${conflict.frontendKey2}: €${conflict.price2.price_min}`);
    console.log(`     ⚠️  Only ${conflict.frontendKey1} will be used (first found)`);
  });
} else {
  console.log('\n✅ No conflicts detected - all mappings are unique!');
}