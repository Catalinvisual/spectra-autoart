// Test detaliat pentru servicii
const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, data });
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

async function testServiceAPI() {
  console.log('🔍 Test detaliat pentru API servicii...\n');
  
  try {
    // Test 1: Verificăm ruta de servicii
    console.log('📡 Test 1: GET /api/services-with-prices?lang=nl');
    
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/services-with-prices?lang=nl',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    
    const result = await makeRequest(options);
    console.log(`📊 Status: ${result.statusCode}`);
    console.log(`📋 Headers:`, result.headers);
    
    if (result.statusCode === 200) {
      try {
        const data = JSON.parse(result.data);
        console.log(`✅ JSON valid găsit`);
        console.log(`📊 Număr servicii: ${data.data.length}`);
        
        if (data.data.length > 0) {
          console.log(`\n📋 Primul serviciu:`);
          console.log(`   ID: ${data.data[0].id}`);
          console.log(`   Nume: ${data.data[0].name}`);
          console.log(`   Descriere: ${data.data[0].description}`);
          console.log(`   Categorie: ${data.data[0].category}`);
          console.log(`   Prețuri: ${data.data[0].prices.length}`);
        }
      } catch (e) {
        console.log(`❌ Eroare la parsare JSON: ${e.message}`);
        console.log(`📄 Răspuns brut (primele 500 caractere):`);
        console.log(result.data.substring(0, 500));
      }
    } else {
      console.log(`❌ Eroare HTTP ${result.statusCode}`);
      console.log(`📄 Răspuns: ${result.data}`);
    }
    
  } catch (error) {
    console.log(`❌ Eroare de conexiune: ${error.message}`);
  }
  
  console.log('\n✅ Test complet!');
}

// Rulează testul
testServiceAPI().catch(console.error);