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

async function fixServiceDisplayIssue() {
  console.log('🔄 === REZOLVARE DEFINITIVĂ PROBLEMĂ AFIȘARE SERVICIU ===');
  
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
    
    console.log(`📊 Găsite ${servicesData.length} servicii în total`);
    
    // Căutăm serviciile relevante
    let problemService = null;
    let correctService = null;
    let changesMade = 0;
    
    console.log('\n🔍 Căutare servicii...');
    
    servicesData.forEach((service, index) => {
      const serviceId = String(service[0] || '').trim();
      const nameNL = service[2];
      const nameEN = service[3];
      const isActive = service[7];
      
      // Serviciul problemă (176504569) - cel afișat în admin panel
      if (serviceId === '176504569') {
        problemService = { service, index, nameNL, nameEN, isActive };
        console.log(`❌ Găsit serviciul PROBLEMĂ: ID=${serviceId}, Nume="${nameNL}", Activ=${isActive}`);
      }
      
      // Serviciul corect (176505237) - cel pe care l-am configurat
      else if (serviceId === '176505237') {
        correctService = { service, index, nameNL, nameEN, isActive };
        console.log(`✅ Găsit serviciul CORECT: ID=${serviceId}, Nume="${nameNL}", Activ=${isActive}`);
      }
    });
    
    // Rezolvăm problema
    if (problemService) {
      console.log('\n❌ Dezactivare serviciul problemă...');
      problemService.service[7] = 'FALSE'; // Setăm Is_Active pe FALSE
      
      const rowIndex = problemService.index + 2; // +2 pentru header și index 1-based
      await sheetsService.updateData('Vehicle_Services', rowIndex, problemService.service);
      changesMade++;
      console.log('✅ Serviciul problemă dezactivat');
    }
    
    if (correctService) {
      console.log('\n✅ Actualizare serviciul corect...');
      let needsUpdate = false;
      
      // Activăm serviciul dacă nu este activ
      if (correctService.isActive !== 'TRUE') {
        correctService.service[7] = 'TRUE';
        needsUpdate = true;
        console.log('✅ Serviciul corect activat');
      }
      
      // Actualizăm numele în olandeză dacă este necesar
      if (correctService.nameNL !== 'Interieurreiniging Premium') {
        correctService.service[2] = 'Interieurreiniging Premium';
        needsUpdate = true;
        console.log('✅ Numele serviciului corect actualizat');
      }
      
      if (needsUpdate) {
        const rowIndex = correctService.index + 2;
        await sheetsService.updateData('Vehicle_Services', rowIndex, correctService.service);
        changesMade++;
        console.log('✅ Serviciul corect actualizat');
      } else {
        console.log('ℹ️ Serviciul corect era deja configurat corect');
      }
    }
    
    // Dezactivăm și alte servicii duplicate 176504xxx
    console.log('\n🧹 Verificare duplicate...');
    for (let i = 0; i < servicesData.length; i++) {
      const service = servicesData[i];
      const serviceId = String(service[0] || '').trim();
      const isActive = service[7];
      
      if (serviceId.startsWith('176504') && serviceId !== '176504569' && isActive === 'TRUE') {
        console.log(`🗑️ Dezactivare duplicat: ${serviceId}`);
        service[7] = 'FALSE';
        await sheetsService.updateData('Vehicle_Services', i + 2, service);
        changesMade++;
      }
    }
    
    console.log(`\n🎉 === REZULTAT FINAL ===`);
    console.log(`✅ ${changesMade} modificări efectuate`);
    
    if (problemService) {
      console.log('✅ Serviciul problemă (176504569) dezactivat');
    }
    
    if (correctService) {
      console.log('✅ Serviciul corect (176505237) activat și actualizat');
    }
    
    console.log('\n🔧 Admin panel ar trebui să afișeze acum:');
    console.log('   📋 Nume: Interieurreiniging Premium');
    console.log('   💰 Prețuri: sedan €11, suv €22, hatchback €33, cabrio €44, coupe €55, wagon €66, van €77, break €88');
    
    // Verificare finală
    console.log('\n🔍 Verificare finală...');
    const finalServices = await sheetsService.getData('Vehicle_Services');
    const activeServices = finalServices.filter(s => s[7] === 'TRUE');
    
    console.log(`📊 Servicii active finale: ${activeServices.length}`);
    activeServices.forEach(service => {
      console.log(`   🟢 ${service[0]} - "${service[2]}"`);
    });
    
    // Verificăm și prețurile
    console.log('\n💰 Verificare prețuri serviciu corect...');
    const pricesData = await sheetsService.getData('Vehicle_Service_Prices');
    const correctPrices = pricesData.filter(price => {
      const serviceId = String(price[1] || '').trim();
      return serviceId === '176505237';
    });
    
    console.log(`📊 Prețuri găsite pentru serviciul 176505237: ${correctPrices.length}`);
    correctPrices.forEach(price => {
      const bodyType = price[2];
      const priceValue = price[3];
      console.log(`   - ${bodyType}: ${priceValue} EUR`);
    });
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error(error.stack);
  }
}

fixServiceDisplayIssue();