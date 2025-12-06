import dotenv from 'dotenv'
import { GoogleSheetsService } from './src/services/googleSheetsService.js';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env' })

// Setăm manual ID-ul spreadsheet-ului și cheia privată pentru testare
process.env.GOOGLE_SHEETS_SPREADSHEET_ID = '1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90';

// Extragem cheia privată din fișierul .env dacă există
const envPath = path.resolve('.env');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const privateKeyMatch = envContent.match(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/);
  if (privateKeyMatch) {
    process.env.GOOGLE_PRIVATE_KEY = privateKeyMatch[0].replace(/\\n/g, '\n');
  }
}

process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'spectra-autoart@spectra-autoart.iam.gserviceaccount.com';

async function debugServicesData() {
  console.log('🔍 === DEBUG STRUCTURĂ DATE SERVICII ===');
  
  try {
    // Inițializare Google Sheets folosind serviciul existent
    console.log('📊 Initializare Google Sheets...');
    
    const sheetsService = new GoogleSheetsService();
    const initialized = await sheetsService.initialize();
    
    if (!initialized) {
      console.log('❌ Nu s-a putut initializa Google Sheets');
      return;
    }
    
    console.log('✅ Google Sheets initializat cu succes');
    
    // Obținem toate serviciile
    console.log('📋 Obținere date servicii...');
    
    const servicesData = await sheetsService.getData('Vehicle_Services');
    
    if (!servicesData) {
      console.log('❌ Nu s-au putut obține datele');
      return;
    }
    
    console.log(`✅ Date obținute: ${servicesData.length} servicii`);
    
    // Afișăm structura primelor câteva servicii
    console.log('\n📋 Structura primelor 3 servicii:');
    
    servicesData.slice(0, 3).forEach((service, index) => {
      console.log(`\nServiciul ${index + 1}:`);
      console.log(`   Tip date: ${typeof service}`);
      console.log(`   Obiect complet:`, JSON.stringify(service, null, 2));
    });
    
    // Căutăm serviciul specific după ID
    console.log('\n🔍 Căutare serviciu cu ID: service-1765031641956-765');
    
    const targetService = servicesData.find(service => {
      const serviceId = service.ID || service.id || service.Id || service['ID'] || service['id'];
      console.log(`Verific ID: ${serviceId} (tip: ${typeof serviceId})`);
      return String(serviceId || '').trim() === 'service-1765031641956-765';
    });
    
    if (targetService) {
      console.log('✅ Serviciu găsit!');
      console.log(`   Obiect complet:`, JSON.stringify(targetService, null, 2));
    } else {
      console.log('❌ Serviciul nu a fost găsit');
      
      // Căutăm după nume sau descriere
      console.log('\n🔍 Căutare după conținut "interieur" sau "reiniging"');
      
      const matchingServices = servicesData.filter(service => {
        const nameNL = String(service.Name_NL || service.Name || service.name || service['Name_NL'] || service['Name'] || '').toLowerCase();
        const nameEN = String(service.Name_EN || service.nameEN || service['Name_EN'] || '').toLowerCase();
        const descNL = String(service.Description_NL || service.Description || service.description || service['Description_NL'] || service['Description'] || '').toLowerCase();
        const descEN = String(service.Description_EN || service.descriptionEN || service['Description_EN'] || '').toLowerCase();
        
        return nameNL.includes('interieur') || nameEN.includes('interieur') ||
               nameNL.includes('reiniging') || nameEN.includes('reiniging') ||
               descNL.includes('interieur') || descEN.includes('interieur') ||
               descNL.includes('reiniging') || descEN.includes('reiniging');
      });
      
      console.log(`✅ Găsite ${matchingServices.length} servicii potențiale:`);
      
      matchingServices.forEach((service, index) => {
        console.log(`\nServiciu ${index + 1}:`);
        console.log(`   Obiect complet:`, JSON.stringify(service, null, 2));
      });
    }
    
    // Verificăm și prețurile
    console.log('\n💰 Verificare prețuri pentru serviciul dorit...');
    
    const pricesData = await sheetsService.getData('Vehicle_Service_Prices');
    
    if (pricesData) {
      console.log(`✅ Date prețuri obținute: ${pricesData.length} prețuri`);
      
      // Căutăm prețuri pentru ID-ul specific
      const targetPrices = pricesData.filter(price => {
        const serviceId = price.Service_ID || price.service_id || price['Service_ID'] || price['service_id'];
        return String(serviceId || '').trim() === 'service-1765031641956-765';
      });
      
      console.log(`✅ Găsite ${targetPrices.length} prețuri pentru serviciul dorit:`);
      
      targetPrices.forEach((price, index) => {
        console.log(`\nPreț ${index + 1}:`);
        console.log(`   Obiect complet:`, JSON.stringify(price, null, 2));
      });
    }
    
    console.log('\n✅ Debug complet finalizat');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Rulează scriptul
debugServicesData().then(() => {
  console.log('\n🚀 Debug finalizat!');
  process.exit(0);
}).catch(err => {
  console.error('\n💥 Debug eșuat:', err);
  process.exit(1);
});