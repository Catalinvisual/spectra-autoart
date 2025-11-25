// Test simplificat pentru servicii - fără autentificare
const https = require('https');
const http = require('http');

const testServices = [
  {
    name: 'Spălare Premium',
    description: 'Spălare completă exterioară și interioară cu produse de calitate superioară',
    category: 'exterior',
    duration_minutes: 60,
    expected_lang: 'ro'
  }
];

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testServiceTranslation() {
  console.log('🧪 Test simplificat pentru servicii...\n');
  
  const service = testServices[0];
  
  console.log(`🧪 Test: ${service.name}`);
  console.log(`📝 Original: ${service.description}`);
  console.log(`🔍 Expected language: ${service.expected_lang}`);
  
  try {
    // Testăm mai întâi GET pentru a vedea dacă serviciile funcționează
    console.log('\n🔍 Testăm GET /api/services-with-prices?lang=nl...');
    
    const getOptions = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/services-with-prices?lang=nl',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const getResult = await makeRequest(getOptions);
    console.log(`✅ GET Status: ${getResult.statusCode}`);
    
    if (getResult.statusCode === 200) {
      const services = JSON.parse(getResult.data);
      console.log(`📊 Servicii găsite: ${services.data.length}`);
      
      if (services.data.length > 0) {
        const lastService = services.data[services.data.length - 1];
        console.log(`📋 Ultimul serviciu: ${lastService.name}`);
        console.log(`   Descriere: ${lastService.description}`);
        console.log(`   Categorie: ${lastService.category}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Eroare: ${error.message}`);
  }
  
  console.log('\n✅ Test complet!');
}

// Rulează testul
testServiceTranslation().catch(console.error);