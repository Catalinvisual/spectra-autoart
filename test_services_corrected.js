const http = require('http');

async function makeRequest(options) {
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

// Testăm și POST pentru creare serviciu
async function testServiceCreation() {
  console.log('\n🔍 Test creare serviciu cu traducere automată...\n');
  
  const newService = {
    name: "Test Service Română",
    description: "Acesta este un serviciu de test în limba română",
    price: 99.99,
    duration: 90,
    category: "test",
    is_active: true
  };
  
  try {
    const postData = JSON.stringify(newService);
    
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/vehicle-services',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    console.log('🌐 Creare serviciu:', newService.name);
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`📄 Răspuns:`, data);
        
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Serviciu creat cu succes!');
        } else {
          console.log('❌ Eroare la creare serviciu');
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Eroare la cerere: ${error.message}`);
    });
    
    req.write(postData);
    req.end();
    
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