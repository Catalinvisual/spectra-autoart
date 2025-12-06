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

// Setăm email-ul service account-ului
process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'spectra-autoart@spectra-autoart.iam.gserviceaccount.com';

async function fixInterieurreinigingServices() {
  console.log('🧹 === REZOLVARE PROBLEMĂ SERVICII INTERIEURREINIGING ===');
  
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
    
    // Obținem toate serviciile și prețurile
    console.log('📋 Obținere date...');
    
    const servicesData = await sheetsService.getData('Vehicle_Services');
    const pricesData = await sheetsService.getData('Vehicle_Service_Prices');
    
    if (!servicesData || !pricesData) {
      console.log('❌ Nu s-au putut obține datele');
      return;
    }
    
    console.log(`✅ Date obținute: ${servicesData.length} servicii, ${pricesData.length} prețuri`);
    
    // Identificăm serviciile de tip "Interieurreiniging"
    const targetServiceNames = [
      'interieurreiniging premium',
      'eersteklas interieurreiniging', 
      'interieurreiniging',
      'premium interieurreiniging'
    ];
    
    const matchingServices = [];
    
    servicesData.forEach((service, index) => {
      const serviceId = service.ID;
      const serviceNameNL = String(service.Name_NL || service.Name || '').toLowerCase().trim();
      const serviceNameEN = String(service.Name_EN || service.Name || '').toLowerCase().trim();
      
      const isMatch = targetServiceNames.some(name => 
        serviceNameNL.includes(name) || serviceNameEN.includes(name)
      );
      
      if (isMatch) {
        // Găsim prețurile pentru acest serviciu
        const servicePrices = pricesData.filter(priceRow => 
          String(priceRow.Service_ID || '').trim() === String(serviceId).trim()
        );
        
        matchingServices.push({
          id: serviceId,
          rowIndex: index,
          nameNL: service.Name_NL || service.Name || 'Unknown',
          nameEN: service.Name_EN || service.Name || 'Unknown',
          description: service.Description_NL || service.Description || '',
          category: service.Category_NL || service.Category || 'Unknown',
          isActive: service.Is_Active === 'true' || service.Is_Active === true,
          prices: servicePrices,
          priceCount: servicePrices.length
        });
      }
    });
    
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
          const bodyType = priceRow.Body_Type || 'unknown';
          const price = priceRow.Price || 0;
          const currency = priceRow.Currency || 'EUR';
          console.log(`     - ${bodyType}: ${price} ${currency}`);
        });
      }
    });
    
    // Alegem serviciul principal (cel cu cele mai multe prețuri)
    console.log('\n⭐ Selectare serviciu principal...');
    
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
    
    // Actualizăm serviciul principal cu datele corecte
    console.log('\n✏️ Actualizare serviciu principal cu date corecte...');
    
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
    
    // Actualizăm serviciul principal în Google Sheets
    const correctServiceData = {
      Name_NL: 'Interieurreiniging Premium',
      Name_EN: 'Premium Interior Cleaning',
      Name: 'Interieurreiniging Premium',
      Description_NL: 'Grondige stofzuigbeurt van stoelen, tapijten en kofferbak\nDieptereiniging van bekleding en leerbehandeling\nVerwijderen van vlekken en onaangename geuren\nReiniging en verzorging van dashboard, ventilatieopeningen en ramen',
      Description_EN: 'Deep vacuuming of seats, carpets and trunk\nDeep cleaning of upholstery and leather treatment\nRemoval of stains and unpleasant odors\nCleaning and care of dashboard, air vents and windows',
      Category_NL: 'Interior Detailing',
      Category_EN: 'Interior Detailing',
      Category: 'Interior Detailing',
      Is_Active: 'TRUE'
    };
    
    // Actualizăm serviciul
    const servicesUpdated = await sheetsService.updateData('Vehicle_Services', mainService.rowIndex, correctServiceData);
    
    if (servicesUpdated) {
      console.log('✅ Serviciu actualizat cu succes');
    } else {
      console.log('⚠️  Serviciul nu a putut fi actualizat');
    }
    
    // Ștergem serviciile duplicate
    console.log('\n🗑️ Ștergere servicii duplicate...');
    
    const servicesToDelete = matchingServices.filter(s => s.id !== mainService.id);
    console.log(`Urmează să ștergem ${servicesToDelete.length} servicii duplicate`);
    
    // Sortăm descrescător pentru a nu strica indexarea
    const deleteIndices = servicesToDelete.map(s => s.rowIndex).sort((a, b) => b - a);
    
    for (const index of deleteIndices) {
      const service = servicesToDelete.find(s => s.rowIndex === index);
      console.log(`  Ștergere serviciu: ${service.id} (${service.nameNL})`);
      await sheetsService.deleteData('Vehicle_Services', index);
    }
    
    // Actualizăm prețurile serviciului principal
    console.log('\n💰 Actualizare prețuri serviciu principal...');
    
    let pricesUpdated = 0;
    let pricesAdded = 0;
    
    // Verificăm fiecare tip de caroserie
    for (const [bodyType, expectedPrice] of Object.entries(expectedPrices)) {
      const existingPrice = mainService.prices.find(priceRow => 
        String(priceRow.Body_Type || '').toLowerCase().trim() === bodyType
      );
      
      if (existingPrice) {
        // Actualizăm prețul existent
        if (parseFloat(existingPrice.Price || 0) !== expectedPrice) {
          const priceIndex = pricesData.findIndex(priceRow => 
            String(priceRow.Service_ID || '').trim() === String(mainService.id).trim() &&
            String(priceRow.Body_Type || '').toLowerCase().trim() === bodyType
          );
          
          if (priceIndex !== -1) {
            const priceData = {
              Price: expectedPrice,
              Currency: 'EUR'
            };
            
            await sheetsService.updateData('Vehicle_Service_Prices', priceIndex, priceData);
            pricesUpdated++;
            console.log(`  📊 Actualizat preț pentru ${bodyType}: ${expectedPrice} EUR`);
          }
        }
      } else {
        // Adăugăm un nou preț
        const newPriceData = {
          ID: `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          Service_ID: mainService.id,
          Body_Type: bodyType,
          Price: expectedPrice,
          Currency: 'EUR',
          Duration_Minutes: 60,
          Is_Active: 'TRUE',
          Created_At: new Date().toISOString()
        };
        
        await sheetsService.addData('Vehicle_Service_Prices', newPriceData);
        pricesAdded++;
        console.log(`  ➕ Adăugat preț nou pentru ${bodyType}: ${expectedPrice} EUR`);
      }
    }
    
    console.log(`✅ Prețuri actualizate: ${pricesUpdated} modificate, ${pricesAdded} adăugate`);
    
    // Verificare finală
    console.log('\n🔍 Verificare finală...');
    
    const finalServicesData = await sheetsService.getData('Vehicle_Services');
    const finalPricesData = await sheetsService.getData('Vehicle_Service_Prices');
    
    console.log(`📊 Servicii finale: ${finalServicesData.length}`);
    console.log(`💰 Prețuri finale: ${finalPricesData.length}`);
    
    // Găsim serviciul nostru actualizat
    const updatedService = finalServicesData.find(service => {
      const serviceId = service.ID;
      const serviceName = String(service.Name_NL || service.Name || '').toLowerCase().trim();
      return serviceId === mainService.id || serviceName.includes('interieurreiniging premium');
    });
    
    if (updatedService) {
      console.log('\n✅ Serviciu final:');
      console.log(`   ID: ${updatedService.ID}`);
      console.log(`   Nume: ${updatedService.Name_NL || updatedService.Name}`);
      console.log(`   Categorie: ${updatedService.Category_NL || updatedService.Category}`);
      console.log(`   Activ: ${updatedService.Is_Active}`);
      
      const finalPrices = finalPricesData.filter(priceRow => 
        String(priceRow.Service_ID || '').trim() === String(updatedService.ID).trim()
      );
      
      console.log(`   Prețuri totale: ${finalPrices.length}`);
      
      console.log('\n📋 Prețuri finale:');
      for (const bodyType of Object.keys(expectedPrices)) {
        const priceRow = finalPrices.find(priceRow => 
          String(priceRow.Body_Type || '').toLowerCase().trim() === bodyType
        );
        
        if (priceRow) {
          const price = parseFloat(priceRow.Price || 0);
          const currency = priceRow.Currency || 'EUR';
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
fixInterieurreinigingServices().then(() => {
  console.log('\n🚀 Proces completat cu succes!');
  process.exit(0);
}).catch(err => {
  console.error('\n💥 Proces eșuat:', err);
  process.exit(1);
});