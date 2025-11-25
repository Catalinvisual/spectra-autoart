// Test script pentru servicii cu traducere automată

const testServices = [
  {
    name: 'Spălare Premium',
    description: 'Spălare completă exterioară și interioară cu produse de calitate superioară',
    category: 'exterior',
    duration_minutes: 60,
    expected_lang: 'ro'
  },
  {
    name: 'Premium Wash Service',
    description: 'Complete exterior and interior wash with premium quality products',
    category: 'exterior', 
    duration_minutes: 60,
    expected_lang: 'en'
  },
  {
    name: 'Uitstekende Wasbeurt',
    description: 'Complete exterieur en interieur wasbeurt met hoogwaardige producten',
    category: 'exterior',
    duration_minutes: 60,
    expected_lang: 'nl'
  }
];

async function testServiceTranslation() {
  console.log('🧪 Începem testarea serviciilor cu traducere automată...\n');
  
  for (let i = 0; i < testServices.length; i++) {
    const service = testServices[i];
    
    console.log(`🧪 Test ${i + 1}: ${service.name}`);
    console.log(`📝 Original: ${service.description}`);
    console.log(`🔍 Expected language: ${service.expected_lang}`);
    
    try {
      const response = await fetch('http://localhost:8080/api/vehicle-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-test-token' // Va trebui să înlocuiești cu un token valid
        },
        body: JSON.stringify({
          name: service.name,
          description: service.description,
          category: service.category,
          duration_minutes: service.duration_minutes,
          default_prices: {
            hatchback: { price_min: 25, price_max: 35, duration_minutes: 45 },
            berlina: { price_min: 30, price_max: 40, duration_minutes: 50 },
            suv: { price_min: 35, price_max: 45, duration_minutes: 60 }
          }
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Status: SUCCESS - Serviciu adăugat cu ID: ${result.data.service.id}`);
      } else {
        const error = await response.json();
        console.log(`❌ Status: FAILED - ${error.error}`);
      }
      
    } catch (error) {
      console.log(`❌ Status: ERROR - ${error.message}`);
    }
    
    console.log(''); // Linie goală pentru separare
    
    // Așteaptă 2 secunde între teste pentru a evita overload
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('⏳ Aștept 5 secunde pentru procesare...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('\n🔍 Verificare servicii în Google Sheets...');
  
  try {
    const response = await fetch('http://localhost:8080/api/services-with-prices?lang=nl');
    if (response.ok) {
      const result = await response.json();
      console.log(`📊 Total servicii: ${result.data.length}`);
      
      console.log('\n📋 Ultimele servicii adăugate:');
      result.data.slice(-3).forEach((service, index) => {
        console.log(`${index + 1}. ${service.name} (${service.category})`);
        console.log(`   Descriere: ${service.description}`);
        console.log(`   Durată: ${service.duration_minutes} minute`);
        if (service.prices && service.prices.length > 0) {
          console.log(`   Prețuri: ${service.prices.length} tipuri de caroserie`);
        }
        console.log('');
      });
    }
  } catch (error) {
    console.log(`❌ Eroare la verificarea serviciilor: ${error.message}`);
  }
  
  console.log('\n✅ Test complet!');
}

// Rulează testul
testServiceTranslation().catch(console.error);