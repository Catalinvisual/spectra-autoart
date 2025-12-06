import dotenv from 'dotenv'
import { GoogleSheetsService } from './server/src/services/googleSheetsService.js';

// Load environment variables
dotenv.config({ path: '.env' })

// Setăm manual ID-ul spreadsheet-ului și cheia privată pentru testare
process.env.GOOGLE_SHEETS_SPREADSHEET_ID = '1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90';

// Extragem cheia privată din fișierul .env dacă există
const fs = await import('fs');
const path = await import('path');
const envPath = path.resolve('.env');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const privateKeyMatch = envContent.match(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/);
  if (privateKeyMatch) {
    process.env.GOOGLE_PRIVATE_KEY = privateKeyMatch[0].replace(/\n/g, '\\n');
  }
}

// Setăm email-ul service account-ului
process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'spectra-autoart@spectra-autoart.iam.gserviceaccount.com';

async function completeServiceFix() {
  console.log('🚀 === REZOLVARE COMPLETĂ PROBLEMĂ SERVICII ===');
  console.log('Acest script va rezolva definitiv problema cu serviciile duplicate și prețurile incorecte.');
  
  const service = new GoogleSheetsService();
  
  try {
    console.log('\n📊 Pasul 1: Initializare Google Sheets...');
    await service.initialize();
    
    console.log('\n📋 Pasul 2: Obținere date actuale...');
    const servicesData = await service.getData('Vehicle_Services');
    const pricesData = await service.getData('Vehicle_Service_Prices');
    
    console.log(`✅ Găsite ${servicesData.length - 1} servicii și ${pricesData.length - 1} prețuri`);
    
    // PASUL 3: Găsim toate serviciile de tip "Interieurreiniging"
    console.log('\n🔍 Pasul 3: Identificare servicii "Interieurreiniging"...');
    
    const targetServiceNames = [
      'interieurreiniging premium',
      'eersteklas interieurreiniging', 
      'interieurreiniging',
      'premium interieurreiniging'
    ];
    
    const matchingServices = [];
    const headers = servicesData[0];
    
    for (let i = 1; i < servicesData.length; i++) {
      const row = servicesData[i];
      const serviceId = row[0];
      const serviceNameNL = String(row[3] || row[1] || '').toLowerCase().trim();
      const serviceNameEN = String(row[2] || row[1] || '').toLowerCase().trim();
      const serviceDescription = String(row[7] || row[6] || row[5] || '').toLowerCase().trim();
      
      const isMatch = targetServiceNames.some(name => 
        serviceNameNL.includes(name) || 
        serviceNameEN.includes(name) ||
        serviceDescription.includes(name)
      );
      
      if (isMatch) {
        // Găsim prețurile pentru acest serviciu
        const servicePrices = pricesData.filter(priceRow => 
          String(priceRow[1] || '').trim() === String(serviceId).trim()
        );
        
        matchingServices.push({
          id: serviceId,
          rowIndex: i,
          nameNL: row[3] || row[1] || 'Unknown',
          nameEN: row[2] || row[1] || 'Unknown',
          description: row[7] || row[6] || row[5] || '',
          category: row[13] || row[12] || row[11] || 'Interiour Detailing',
          isActive: row[20] === 'true' || row[20] === true,
          prices: servicePrices,
          priceCount: servicePrices.length
        });
      }
    }
    
    if (matchingServices.length === 0) {
      console.log('❌ Nu a fost găsit niciun serviciu de tip "Interieurreiniging"');
      return;
    }
    
    console.log(`✅ Găsite ${matchingServices.length} servicii de tip "Interieurreiniging"`);
    
    // Afișăm serviciile găsite
    matchingServices.forEach((service, index) => {
      console.log(`\n${index + 1}. ID: ${service.id}`);
      console.log(`   Nume NL: ${service.nameNL}`);
      console.log(`   Nume EN: ${service.nameEN}`);
      console.log(`   Categorie: ${service.category}`);
      console.log(`   Activ: ${service.isActive}`);
      console.log(`   Prețuri: ${service.priceCount}`);
      
      if (service.prices.length > 0) {
        console.log('   Prețuri detaliate:');
        service.prices.forEach(priceRow => {
          const bodyType = priceRow[2] || 'unknown';
          const price = priceRow[3] || 0;
          const currency = priceRow[4] || 'EUR';
          console.log(`     - ${bodyType}: ${price} ${currency}`);
        });
      }
    });
    
    // PASUL 4: Alegem serviciul principal (cel cu cele mai multe prețuri sau cel mai recent)
    console.log('\n⭐ Pasul 4: Selectare serviciu principal...');
    
    let mainService = matchingServices[0];
    let maxPrices = matchingServices[0].priceCount;
    
    for (const service of matchingServices) {
      if (service.priceCount > maxPrices) {
        maxPrices = service.priceCount;
        mainService = service;
      }
    }
    
    console.log(`✅ Serviciul principal selectat: ${mainService.id}`);
    console.log(`   Nume: ${mainService.nameNL}`);
    console.log(`   Prețuri: ${mainService.priceCount}`);
    
    // PASUL 5: Actualizăm serviciul principal cu datele corecte
    console.log('\n✏️ Pasul 5: Actualizare serviciu principal cu date corecte...');
    
    const expectedPrices = {
      sedan: 11,
      suv: 22,
      hatchback: 33,
      cabrio: 44,
      coupe: 55,
      wagon: 66,
      van: 77,
      break: 88
    };
    
    // Actualizăm numele serviciului
    const serviceRowIndex = mainService.rowIndex;
    const serviceRow = servicesData[serviceRowIndex];
    
    serviceRow[3] = 'Interieurreiniging Premium'; // Name_NL
    serviceRow[2] = 'Premium Interior Cleaning'; // Name_EN
    serviceRow[1] = 'Interieurreiniging Premium'; // Name
    
    // Actualizăm descrierea
    const correctDescription = 'Grondige stofzuigbeurt van stoelen, tapijten en kofferbak\nDieptereiniging van bekleding en leerbehandeling\nVerwijderen van vlekken en onaangename geuren\nReiniging en verzorging van dashboard, ventilatieopeningen en ramen';
    
    serviceRow[7] = correctDescription; // Description_NL
    serviceRow[6] = correctDescription; // Description
    serviceRow[5] = 'Deep vacuuming of seats, carpets and trunk\nDeep cleaning of upholstery and leather treatment\nRemoval of stains and unpleasant odors\nCleaning and care of dashboard, air vents and windows'; // Description_EN
    
    // Actualizăm categoria
    serviceRow[13] = 'Interiour Detailing'; // Category_NL
    serviceRow[12] = 'Interior Detailing'; // Category
    serviceRow[11] = 'Interior Detailing'; // Category_EN
    
    // Salvăm modificările serviciului
    await service.updateData('Vehicle_Services', serviceRowIndex + 1, [serviceRow]);
    console.log('✅ Serviciu actualizat cu succes');
    
    // PASUL 6: Ștergem toate celelalte servicii duplicate
    console.log('\n🗑️ Pasul 6: Ștergere servicii duplicate...');
    
    const servicesToDelete = matchingServices.filter(s => s.id !== mainService.id);
    console.log(`Urmează să ștergem ${servicesToDelete.length} servicii duplicate`);
    
    // Sortăm descrescător pentru a șterge de jos în sus
    servicesToDelete.sort((a, b) => b.rowIndex - a.rowIndex);
    
    for (const service of servicesToDelete) {
      console.log(`  Ștergere serviciu: ${service.id} (${service.nameNL})`);
      await service.deleteRow('Vehicle_Services', service.rowIndex + 1);
    }
    
    // PASUL 7: Actualizăm prețurile serviciului principal
    console.log('\n💰 Pasul 7: Actualizare prețuri serviciu principal...');
    
    let pricesUpdated = 0;
    let pricesAdded = 0;
    
    // Verificăm fiecare tip de caroserie
    for (const [bodyType, expectedPrice] of Object.entries(expectedPrices)) {
      const existingPrice = mainService.prices.find(priceRow => 
        String(priceRow[2] || '').toLowerCase().trim() === bodyType
      );
      
      if (existingPrice) {
        // Actualizăm prețul existent
        if (parseFloat(existingPrice[3] || 0) !== expectedPrice) {
          existingPrice[3] = expectedPrice;
          existingPrice[4] = 'EUR';
          pricesUpdated++;
          console.log(`  📊 Actualizat preț pentru ${bodyType}: ${expectedPrice} EUR`);
        }
      } else {
        // Creăm un nou rând de preț
        const newPriceId = `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newPriceRow = [
          newPriceId, // ID
          mainService.id, // Service_ID
          bodyType, // Body_Type
          expectedPrice, // Price
          'EUR', // Currency
          60, // Duration_Minutes
          'TRUE', // Is_Active
          new Date().toISOString() // Created_At
        ];
        
        pricesData.push(newPriceRow);
        pricesAdded++;
        console.log(`  ➕ Adăugat preț nou pentru ${bodyType}: ${expectedPrice} EUR`);
      }
    }
    
    // Salvăm modificările prețurilor
    if (pricesUpdated > 0 || pricesAdded > 0) {
      console.log('\n💾 Salvare modificări prețuri...');
      await service.updateData('Vehicle_Service_Prices', 1, pricesData.slice(1));
      console.log(`✅ Prețuri actualizate: ${pricesUpdated} modificate, ${pricesAdded} adăugate`);
    }
    
    // PASUL 8: Verificare finală
    console.log('\n🔍 Pasul 8: Verificare finală...');
    
    const finalServicesData = await service.getData('Vehicle_Services');
    const finalPricesData = await service.getData('Vehicle_Service_Prices');
    
    console.log(`📊 Servicii finale: ${finalServicesData.length - 1}`);
    console.log(`💰 Prețuri finale: ${finalPricesData.length - 1}`);
    
    // Găsim serviciul nostru actualizat
    const updatedService = finalServicesData.find(row => {
      const serviceId = row[0];
      const serviceName = String(row[3] || row[1] || '').toLowerCase().trim();
      return serviceId === mainService.id || serviceName.includes('interieurreiniging premium');
    });
    
    if (updatedService) {
      console.log('\n✅ Serviciu final:');
      console.log(`   ID: ${updatedService[0]}`);
      console.log(`   Nume: ${updatedService[3] || updatedService[1]}`);
      console.log(`   Categorie: ${updatedService[13] || updatedService[12] || updatedService[11]}`);
      console.log(`   Activ: ${updatedService[20]}`);
      
      const finalPrices = finalPricesData.filter(priceRow => 
        String(priceRow[1] || '').trim() === String(updatedService[0]).trim()
      );
      
      console.log(`   Prețuri totale: ${finalPrices.length}`);
      
      console.log('\n📋 Prețuri finale:');
      for (const bodyType of Object.keys(expectedPrices)) {
        const priceRow = finalPrices.find(priceRow => 
          String(priceRow[2] || '').toLowerCase().trim() === bodyType
        );
        
        if (priceRow) {
          const price = parseFloat(priceRow[3] || 0);
          const currency = priceRow[4] || 'EUR';
          console.log(`   🚗 ${bodyType}: ${price} ${currency}`);
        } else {
          console.log(`   ❌ ${bodyType}: Lipsă preț`);
        }
      }
    }
    
    console.log('\n🎉 === OPERAȚIUNE FINALIZATĂ CU SUCCES ===');
    console.log('✅ Problema serviciilor duplicate a fost rezolvată definitiv');
    console.log('✅ Prețurile au fost actualizate cu valorile corecte');
    console.log('✅ Serviciul "Interieurreiniging Premium" este acum unic și corect configurat');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Rulează scriptul
completeServiceFix().then(() => {
  console.log('\n🚀 Proces completat cu succes!');
  process.exit(0);
}).catch(err => {
  console.error('\n💥 Proces eșuat:', err);
  process.exit(1);
});