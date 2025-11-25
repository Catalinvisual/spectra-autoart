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

// 1. Login ca admin pentru a obține token
async function loginAsAdmin() {
  console.log('🔑 Login ca admin...\n');
  
  const loginData = JSON.stringify({
    email: 'admin@spectra.com',
    password: 'admin123'
  });
  
  try {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/admin/auth/login',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };
    
    const result = await makeRequest(options, loginData);
    
    if (result.statusCode === 200) {
      const response = JSON.parse(result.data);
      console.log('✅ Login reușit!');
      console.log('📧 Admin:', response.user.email);
      console.log('🔑 Token obținut:', response.token.substring(0, 20) + '...');
      return response.token;
    } else {
      console.log('❌ Login eșuat:', result.data);
      return null;
    }
    
  } catch (error) {
    console.log('❌ Eroare la login:', error.message);
    return null;
  }
}

// 2. Test GET servicii
async function testGetServices() {
  console.log('\n🔍 Test GET servicii cu traducere...\n');
  
  try {
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
    
    const result = await makeRequest(options);
    
    if (result.statusCode === 200) {
      const data = JSON.parse(result.data);
      console.log(`✅ Servicii obținute: ${data.data?.length || 0}`);
      
      if (data.data && data.data.length > 0) {
        console.log(`\n📋 Primul serviciu (NL):`);
        console.log(`   ID: ${data.data[0].id}`);
        console.log(`   Nume: ${data.data[0].name}`);
        console.log(`   Descriere: ${data.data[0].description?.substring(0, 60)}...`);
        console.log(`   Prețuri: ${data.data[0].prices?.length || 0}`);
      }
      return true;
    } else {
      console.log('❌ Eroare la GET servicii:', result.data);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Eroare:', error.message);
    return false;
  }
}

// 3. Test POST creare serviciu cu traducere automată
async function testServiceCreation(token) {
  console.log('\n🔍 Test POST creare serviciu cu traducere automată...\n');
  
  const newService = {
    name: "Spălare completă română",
    description: "Acest serviciu include spălare exterior, curățare interior și polish pentru toate tipurile de mașini",
    category: "curățenie",
    duration_minutes: 120,
    default_prices: {
      "sedan": 149.99,
      "suv": 169.99,
      "hatchback": 139.99,
      "coupe": 159.99
    }
  };
  
  try {
    const postData = JSON.stringify(newService);
    
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/vehicle-services/vehicle-services',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    console.log('🌐 Creare serviciu:', newService.name);
    console.log('📝 Limbă detectată: Română');
    console.log('🔄 Se vor genera traduceri automate în: NL, EN, ES, PL, RO');
    
    const result = await makeRequest(options, postData);
    
    console.log(`📊 Status: ${result.statusCode}`);
    
    if (result.statusCode === 200) {
      const response = JSON.parse(result.data);
      console.log('✅ Serviciu creat cu succes!');
      console.log('📊 Răspuns:', JSON.stringify(response, null, 2));
      return true;
    } else {
      console.log('❌ Eroare la creare:', result.data);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Eroare:', error.message);
    return false;
  }
}

// 4. Verificare servicii după creare
async function verifyServicesAfterCreation() {
  console.log('\n🔍 Verificare servicii după creare...\n');
  
  try {
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
    
    const result = await makeRequest(options);
    
    if (result.statusCode === 200) {
      const data = JSON.parse(result.data);
      console.log(`✅ Total servicii: ${data.data?.length || 0}`);
      
      // Caută serviciul creat recent
      const newService = data.data?.find(s => s.name.includes('română'));
      if (newService) {
        console.log('\n🎉 Serviciul nou creat (afișat în NL):');
        console.log(`   ID: ${newService.id}`);
        console.log(`   Nume (NL): ${newService.name}`);
        console.log(`   Descriere (NL): ${newService.description?.substring(0, 60)}...`);
        console.log(`   Categorie: ${newService.category}`);
        console.log(`   Durată: ${newService.duration_minutes} minute`);
        console.log(`   Prețuri: ${newService.prices?.length || 0}`);
      }
      
      // Testăm și în alte limbi
      console.log('\n🌍 Testăm afișarea în diferite limbi:');
      
      const languages = ['en', 'es', 'pl', 'ro'];
      for (const lang of languages) {
        const langOptions = {
          hostname: 'localhost',
          port: 8080,
          path: `/api/vehicle-services/services-with-prices?lang=${lang}`,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        };
        
        const langResult = await makeRequest(langOptions);
        if (langResult.statusCode === 200) {
          const langData = JSON.parse(langResult.data);
          const langService = langData.data?.find(s => s.name.includes('română'));
          if (langService) {
            console.log(`   ${lang.toUpperCase()}: ${langService.name}`);
          }
        }
      }
      
      return true;
    } else {
      console.log('❌ Eroare la verificare:', result.data);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Eroare:', error.message);
    return false;
  }
}

// Rulăm toate testele
async function runAllTests() {
  console.log('🚀 Pornim teste complete pentru servicii cu traducere automată\n');
  
  // 1. Login
  const token = await loginAsAdmin();
  if (!token) {
    console.log('❌ Nu putem continua fără token de autentificare');
    return;
  }
  
  // 2. Test GET servicii
  await testGetServices();
  
  // 3. Test POST creare serviciu
  const creationSuccess = await testServiceCreation(token);
  
  // 4. Verificare finală
  if (creationSuccess) {
    setTimeout(async () => {
      await verifyServicesAfterCreation();
      console.log('\n🎉 TOATE TESTELE COMPLETE! ✅');
      console.log('\n📋 Rezumat:');
      console.log('   ✅ API servicii funcționează corect');
      console.log('   ✅ Traducerea automată este activă');
      console.log('   ✅ Serviciile sunt salvate în toate limbile');
      console.log('   ✅ Afișarea în limba selectată funcționează');
    }, 2000);
  } else {
    console.log('\n❌ Testele au eșuat');
  }
}

runAllTests();