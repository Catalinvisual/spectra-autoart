const http = require('http');

async function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
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

async function testCorrectedAPI() {
  console.log('🔍 Test corectat pentru API servicii...\n');
  
  try {
    // CORRECTED URL: /api/vehicle-services/services-with-prices
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/vehicle-services/services-with-prices?lang=nl',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    
    console.log('🌐 Apelând URL corect:', `http://localhost:8080${options.path}`);
    const result = await makeRequest(options);
    
    console.log(`📊 Status: ${result.statusCode}`);
    console.log(`📋 Content-Type:`, result.headers['content-type']);
    
    if (result.statusCode === 200) {
      try {
        const data = JSON.parse(result.data);
        console.log(`✅ JSON valid găsit`);
        console.log(`📊 Număr servicii:`, data.data?.length || 0);
        
        if (data.data && data.data.length > 0) {
          console.log(`\n📋 Primul serviciu:`);
          console.log(`   ID: ${data.data[0].id}`);
          console.log(`   Nume: ${data.data[0].name}`);
          console.log(`   Descriere: ${data.data[0].description?.substring(0, 50)}...`);
          console.log(`   Prețuri: ${data.data[0].prices?.length || 0}`);
          
          if (data.data[0].prices && data.data[0].prices.length > 0) {
            console.log(`   Primul preț: ${data.data[0].prices[0].price} EUR`);
          }
        }
        
        console.log('\n✅ Test API servicii REUȘIT!');
        
      } catch (e) {
        console.log(`❌ Eroare la parsare JSON: ${e.message}`);
        console.log(`📄 Răspuns brut (primele 500 caractere):`);
        console.log(result.data.substring(0, 500));
      }
    } else {
      console.log(`❌ Status neașteptat: ${result.statusCode}`);
      console.log(`📄 Răspuns brut (primele 500 caractere):`);
      console.log(result.data.substring(0, 500));
    }
    
  } catch (error) {
    console.log(`❌ Eroare de conexiune: ${error.message}`);
  }
}

// Testăm POST pentru creare serviciu cu URL corectat
async function testServiceCreation() {
  console.log('\n🔍 Test creare serviciu cu traducere automată (URL corectat)...\n');
  
  const newService = {
    name: "Test Service Română",
    description: "Acesta este un serviciu de test în limba română",
    category: "test",
    duration_minutes: 90,
    default_prices: {
      "sedan": 99.99,
      "suv": 109.99,
      "hatchback": 89.99
    }
  };
  
  try {
    const postData = JSON.stringify(newService);
    
    // CORRECTED URL: /api/vehicle-services/vehicle-services
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/vehicle-services/vehicle-services',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    console.log('🌐 Creare serviciu:', newService.name);
    console.log('🌐 URL corect:', `http://localhost:8080${options.path}`);
    
    const result = await makeRequest(options, postData);
    
    console.log(`📊 Status: ${result.statusCode}`);
    console.log(`📄 Răspuns:`, result.data);
    
    if (result.statusCode === 200) {
      try {
        const responseData = JSON.parse(result.data);
        console.log('✅ Serviciu creat cu succes!');
        console.log('📊 Răspuns:', responseData);
      } catch (e) {
        console.log('✅ Serviciu creat (răspuns non-JSON)');
      }
    } else {
      console.log('❌ Eroare la creare serviciu');
      if (result.statusCode === 401) {
        console.log('🔑 Este necesară autentificare pentru creare servicii');
      }
    }
    
  } catch (error) {
    console.log(`❌ Eroare: ${error.message}`);
  }
}

// Rulăm testele
async function runTests() {
  await testCorrectedAPI();
  setTimeout(() => {
    testServiceCreation();
  }, 2000);
}

runTests();