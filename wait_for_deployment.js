import axios from 'axios';

const BASE_URL = 'https://spectraautoart.nl/api';
const MAX_RETRIES = 30;
const RETRY_DELAY = 10000; // 10 seconds

async function waitForDeployment() {
  console.log('⏳ Așteptăm finalizarea deployment-ului Railway...');
  console.log('🔄 Vom verifica statusul serverului la fiecare 10 secunde');
  console.log(`🎯 URL: ${BASE_URL}`);
  console.log('');

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`🔍 Încercarea ${attempt}/${MAX_RETRIES}...`);
    
    try {
      // Test health endpoint
      const healthResponse = await axios.get(`${BASE_URL}/health`, { timeout: 15000 });
      console.log('✅ Health endpoint responded:', healthResponse.status);
      
      if (healthResponse.status === 200) {
        console.log('🎉 SERVER ESTE ONLINE!');
        console.log('📊 Răspuns health:', healthResponse.data);
        
        // Test admin endpoints
        console.log('🔐 Testăm endpoint-urile admin...');
        
        try {
          const loginResponse = await axios.post(`${BASE_URL}/admin/auth/login`, {
            email: 'admin@spectra.com',
            password: 'admin123'
          }, { timeout: 15000 });
          
          console.log('✅ Login endpoint responded:', loginResponse.status);
          
          if (loginResponse.data.token) {
            console.log('✅ Autentificare reușită!');
            
            // Test dashboard
            const dashboardResponse = await axios.get(`${BASE_URL}/admin/dashboard`, {
              headers: {
                'Authorization': `Bearer ${loginResponse.data.token}`
              },
              timeout: 15000
            });
            
            console.log('✅ Dashboard endpoint responded:', dashboardResponse.status);
            console.log('🎉 TOATE ENDPOINT-URILE FUNCȚIONEAZĂ!');
            return true;
          }
        } catch (adminError) {
          console.log('⚠️  Admin endpoints încă nu funcționează:', adminError.response?.status || 'TIMEOUT');
        }
        
        return true;
      }
    } catch (error) {
      const status = error.response?.status;
      const isTimeout = error.code === 'ECONNABORTED';
      
      if (isTimeout) {
        console.log(`⏰ Timeout - serverul încă nu răspunde`);
      } else if (status === 502) {
        console.log(`🔴 502 Bad Gateway - deployment în curs`);
      } else if (status === 503) {
        console.log(`🟡 503 Service Unavailable - serverul pornește`);
      } else {
        console.log(`❌ Eroare: ${status || error.message}`);
      }
    }
    
    if (attempt < MAX_RETRIES) {
      console.log(`⏳ Așteptăm ${RETRY_DELAY/1000} secunde înainte de următoarea încercare...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  
  console.log('❌ Serverul nu a devenit disponibil în timpul alocat');
  return false;
}

waitForDeployment().then(success => {
  if (success) {
    console.log('✅ Deployment finalizat cu succes!');
    process.exit(0);
  } else {
    console.log('❌ Deployment eșuat sau serverul nu a devenit disponibil');
    process.exit(1);
  }
}).catch(error => {
  console.error('❌ Eroare în timpul verificării:', error);
  process.exit(1);
});