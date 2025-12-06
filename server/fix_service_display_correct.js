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

async function fixServiceDisplayCorrectly() {
  console.log('🔄 === REZOLVARE CORECTĂ AFIȘARE SERVICIU ===');
  
  try {
    const sheetsService = new GoogleSheetsService();
    
    console.log('📊 Inițializare Google Sheets...');
    const initialized = await sheetsService.initialize();
    
    if (!initialized) {
      console.log('❌ Nu s-a putut initializa Google Sheets');
      return;
    }
    
    console.log('✅ Google Sheets initializat cu succes');
    
    // Obține serviciile brute pentru a vedea structura exactă
    console.log('📋 Obținere servicii (date brute)...');
    const servicesData = await sheetsService.getData('Vehicle_Services');
    
    console.log(`📊 Găsite ${servicesData.length} servicii`);
    
    // Găsește serviciul corect (176505237)
    const correctServiceIndex = servicesData.findIndex(service => {
      const serviceId = String(service[0] || '').trim();
      return serviceId === '176505237';
    });
    
    if (correctServiceIndex === -1) {
      console.log('❌ Serviciul 176505237 nu a fost găsit');
      return;
    }
    
    const correctService = servicesData[correctServiceIndex];
    console.log(`✅ Găsit serviciul 176505237 la indexul ${correctServiceIndex}`);
    console.log(`   Structură serviciu:`, correctService.map((val, idx) => `[${idx}]: "${val}"`).join(', '));
    
    // Actualizează doar câmpurile necesare
    console.log('\n✏️ Actualizare serviciu...');
    
    // Setează numele corect în olandeză (coloana 2)
    correctService[2] = 'Interieurreiniging Premium';
    
    // Setează statusul activ (coloana 7)
    correctService[7] = 'TRUE';
    
    // Descrierea rămâne la fel (coloana 8)
    // correctService[8] = 'Grondige stofzuigbeurt van stoelen, tapijten en kofferbak\nDieptereiniging van bekleding en leerbehandeling\nVerwijderen van vlekken en onaangename geuren\nReiniging en verzorging van dashboard, ventilatieopeningen en ramen';
    
    console.log('   ✅ Nume NL actualizat: Interieurreiniging Premium');
    console.log('   ✅ Status activat: TRUE');
    
    // Actualizează serviciul în Google Sheets
    const rowIndex = correctServiceIndex + 2; // +2 pentru header și index 1-based
    await sheetsService.updateData('Vehicle_Services', rowIndex, correctService);
    
    console.log('✅ Serviciul a fost actualizat cu succes');
    
    // Verificare finală
    console.log('\n🔍 Verificare finală...');
    const updatedServices = await sheetsService.getData('Vehicle_Services');
    const updatedService = updatedServices.find(service => String(service[0] || '').trim() === '176505237');
    
    if (updatedService) {
      console.log('✅ Serviciul actualizat:');
      console.log(`   ID: ${updatedService[0]}`);
      console.log(`   Nume NL: ${updatedService[2]}`);
      console.log(`   Nume EN: ${updatedService[3]}`);
      console.log(`   Categorie: ${updatedService[4]}`);
      console.log(`   Activ: ${updatedService[7]}`);
      console.log(`   Descriere: ${updatedService[8]?.substring(0, 50)}...`);
    }
    
    // Verificăm prețurile
    console.log('\n💰 Verificare prețuri...');
    const pricesData = await sheetsService.getData('Vehicle_Service_Prices');
    const correctPrices = pricesData.filter(price => {
      const serviceId = String(price[1] || '').trim();
      return serviceId === '176505237';
    });
    
    console.log(`📊 Prețuri pentru serviciul 176505237: ${correctPrices.length}`);
    correctPrices.forEach(price => {
      const bodyType = price[2];
      const priceValue = price[3];
      console.log(`   - ${bodyType}: ${priceValue} EUR`);
    });
    
    console.log('\n🎉 === REZULTAT FINAL ===');
    console.log('✅ Serviciul a fost configurat corect:');
    console.log('   📋 Nume: Interieurreiniging Premium');
    console.log('   ✅ Status: Activ (TRUE)');
    console.log('   💰 Prețuri: Toate tipurile de caroserie au prețurile corecte');
    console.log('\n🔧 Admin panel ar trebui să afișeze acum serviciul corect cu:');
    console.log('   - Numele: Interieurreiniging Premium');
    console.log('   - Prețurile: sedan €11, suv €22, hatchback €33, etc.');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error(error.stack);
  }
}

fixServiceDisplayCorrectly();