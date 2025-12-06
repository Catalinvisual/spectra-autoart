// Script pentru a verifica serviciile și a identifica care sunt active
import { GoogleSheetsService } from './src/services/googleSheetsService.js';

// Configurare manuală pentru Google Sheets
const config = {
  spreadsheetId: '1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90',
  serviceAccountEmail: 'spectra-autoart@spectra-autoart.iam.gserviceaccount.com',
  privateKey: '-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5Z1n7XbP++pxM\\n1D1a5h6cKKlQfUN+0Q5iSVEcLnPOV1r5L5b1l2p8W3M1qP1b3JQV5mXYf5z\\n-----END PRIVATE KEY-----\\n'
};

async function analyzeServices() {
  console.log('🔍 === ANALIZĂ SERVICII ȘI PROBLEMĂ AFIȘARE ===');
  
  try {
    // Creează o instanță nouă a serviciului
    const sheetsService = new GoogleSheetsService();
    
    // Setează configurația manual
    sheetsService.config = config;
    
    // Încearcă să inițializezi serviciul
    console.log('📊 Inițializare Google Sheets...');
    
    // Verifică dacă există fișierul de service account
    const fs = await import('fs');
    const path = await import('path');
    
    const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
    let useServiceAccount = false;
    
    if (fs.existsSync(serviceAccountPath)) {
      console.log('✅ Găsit fișier service-account.json, folosim autentificare cu fișier');
      useServiceAccount = true;
      process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;
    } else {
      console.log('ℹ️ Nu există fișier service-account.json, folosim variabile de mediu');
    }
    
    // Setează variabilele de mediu necesare
    process.env.SPREADSHEET_ID = config.spreadsheetId;
    process.env.SERVICE_ACCOUNT_EMAIL = config.serviceAccountEmail;
    process.env.GOOGLE_SHEETS_PRIVATE_KEY = config.privateKey;
    
    // Inițializează serviciul
    await sheetsService.initialize();
    console.log('✅ Google Sheets inițializat cu succes');
    
    // Obține toate serviciile
    console.log('📋 Obținere servicii din Vehicle_Services...');
    const servicesData = await sheetsService.getData('Vehicle_Services');
    
    console.log(`📊 Găsite ${servicesData.length} servicii`);
    console.log('\n🔍 Analiză servicii:');
    
    let activeServices = 0;
    let problemServiceFound = false;
    let correctServiceFound = false;
    
    servicesData.forEach((service, index) => {
      const serviceId = service[0]; // ID este pe coloana 0
      const nameNL = service[2]; // Name_NL este pe coloana 2
      const nameEN = service[3]; // Name_EN este pe coloana 3
      const category = service[4]; // Category este pe coloana 4
      const isActive = service[7]; // Is_Active este pe coloana 7
      
      if (isActive === 'TRUE') {
        activeServices++;
        console.log(`\n🟢 Serviciu ACTIV #${index + 1}:`);
        console.log(`   ID: ${serviceId}`);
        console.log(`   Nume NL: ${nameNL}`);
        console.log(`   Nume EN: ${nameEN}`);
        console.log(`   Categorie: ${category}`);
        
        // Verificăm dacă este serviciul problemă (cel afișat în admin panel)
        if (serviceId === '176504569') {
          console.log(`   ⚠️  Acesta este serviciul PROBLEMĂ afișat în admin panel!`);
          problemServiceFound = true;
        }
        
        // Verificăm dacă este serviciul corect (pe care l-am configurat)
        if (serviceId === '176505237') {
          console.log(`   ✅ Acesta este serviciul CORECT configurat de noi!`);
          correctServiceFound = true;
        }
      }
    });
    
    console.log(`\n📈 Rezumat:`);
    console.log(`   Total servicii: ${servicesData.length}`);
    console.log(`   Servicii active: ${activeServices}`);
    console.log(`   Serviciu problemă găsit: ${problemServiceFound ? 'DA' : 'NU'}`);
    console.log(`   Serviciu corect găsit: ${correctServiceFound ? 'DA' : 'NU'}`);
    
    if (problemServiceFound && correctServiceFound) {
      console.log(`\n🎯 SOLUȚIE:`);
      console.log(`   1. Admin panel afișează serviciul 176504569 (Eersteklas interieurreiniging)`);
      console.log(`   2. Noi am configurat serviciul 176505237 (Interieurreiniging Premium)`);
      console.log(`   3. TREBUIE să dezactivăm serviciul 176504569 și să păstrăm doar 176505237`);
    }
    
    // Obține și prețurile pentru a verifica
    console.log('\n💰 Verificare prețuri pentru serviciul corect (176505237):');
    const pricesData = await sheetsService.getData('Vehicle_Service_Prices');
    
    const correctPrices = pricesData.filter(price => {
      const serviceId = String(price[1] || '').trim(); // Service_ID este pe coloana 1
      return serviceId === '176505237';
    });
    
    console.log(`   Prețuri găsite pentru serviciul 176505237: ${correctPrices.length}`);
    correctPrices.forEach(price => {
      const bodyType = price[2]; // Body_Type este pe coloana 2
      const priceValue = price[3]; // Price este pe coloana 3
      console.log(`   - ${bodyType}: ${priceValue} EUR`);
    });
    
    console.log('\n✅ Analiză completă!');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error(error.stack);
  }
}

analyzeServices();