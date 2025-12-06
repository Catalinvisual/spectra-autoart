import dotenv from 'dotenv'
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '../.env' })

// Setăm manual ID-ul spreadsheet-ului și cheia privată
process.env.GOOGLE_SHEETS_SPREADSHEET_ID = '1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90';

// Extragem cheia privată din fișierul .env
const envPath = path.resolve('../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const privateKeyMatch = envContent.match(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/);
  if (privateKeyMatch) {
    process.env.GOOGLE_PRIVATE_KEY = privateKeyMatch[0];
  }
}

process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'spectra-autoart@spectra-autoart.iam.gserviceaccount.com';

async function fixInterieurreinigingServices() {
  console.log('🧹 === REZOLVARE PROBLEMĂ SERVICII INTERIEURREINIGING ===');
  
  try {
    // Inițializare Google Sheets
    console.log('📊 Initializare Google Sheets...');
    
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    console.log(`✅ Conectat la spreadsheet: ${doc.title}`);
    
    // Obținem sheet-urile
    const servicesSheet = doc.sheetsByTitle['Vehicle_Services'];
    const pricesSheet = doc.sheetsByTitle['Vehicle_Service_Prices'];
    
    if (!servicesSheet || !pricesSheet) {
      throw new Error('Sheet-urile Vehicle_Services sau Vehicle_Service_Prices nu există');
    }
    
    console.log(`📋 Sheet-uri găsite: ${servicesSheet.title} (${servicesSheet.rowCount} rânduri), ${pricesSheet.title} (${pricesSheet.rowCount} rânduri)`);
    
    // Citim toate datele
    const servicesRows = await servicesSheet.getRows();
    const pricesRows = await pricesSheet.getRows();
    
    console.log(`✅ Date citite: ${servicesRows.length} servicii, ${pricesRows.length} prețuri`);
    
    // Găsim toate serviciile de tip "Interieurreiniging"
    const targetServiceNames = [
      'interieurreiniging premium',
      'eersteklas interieurreiniging', 
      'interieurreiniging',
      'premium interieurreiniging'
    ];
    
    const matchingServices = [];
    
    servicesRows.forEach((row, index) => {
      const serviceId = row.ID;
      const serviceNameNL = String(row.Name_NL || row.Name || '').toLowerCase().trim();
      const serviceNameEN = String(row.Name_EN || row.Name || '').toLowerCase().trim();
      
      const isMatch = targetServiceNames.some(name => 
        serviceNameNL.includes(name) || serviceNameEN.includes(name)
      );
      
      if (isMatch) {
        // Găsim prețurile pentru acest serviciu
        const servicePrices = pricesRows.filter(priceRow => 
          String(priceRow.Service_ID || '').trim() === String(serviceId).trim()
        );
        
        matchingServices.push({
          id: serviceId,
          row: row,
          rowIndex: index,
          nameNL: row.Name_NL || row.Name || 'Unknown',
          nameEN: row.Name_EN || row.Name || 'Unknown',
          description: row.Description_NL || row.Description || '',
          category: row.Category_NL || row.Category || 'Unknown',
          isActive: row.Is_Active === 'true' || row.Is_Active === true,
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
    
    // Actualizăm numele și descrierea serviciului
    mainService.row.Name_NL = 'Interieurreiniging Premium';
    mainService.row.Name_EN = 'Premium Interior Cleaning';
    mainService.row.Name = 'Interieurreiniging Premium';
    
    const correctDescription = 'Grondige stofzuigbeurt van stoelen, tapijten en kofferbak\nDieptereiniging van bekleding en leerbehandeling\nVerwijderen van vlekken en onaangename geuren\nReiniging en verzorging van dashboard, ventilatieopeningen en ramen';
    
    mainService.row.Description_NL = correctDescription;
    mainService.row.Description = correctDescription;
    mainService.row.Description_EN = 'Deep vacuuming of seats, carpets and trunk\nDeep cleaning of upholstery and leather treatment\nRemoval of stains and unpleasant odors\nCleaning and care of dashboard, air vents and windows';
    
    // Actualizăm categoria
    mainService.row.Category_NL = 'Interiour Detailing';
    mainService.row.Category = 'Interior Detailing';
    mainService.row.Category_EN = 'Interior Detailing';
    
    // Salvăm modificările serviciului
    await mainService.row.save();
    console.log('✅ Serviciu actualizat cu succes');
    
    // Ștergem toate celelalte servicii duplicate
    console.log('\n🗑️ Ștergere servicii duplicate...');
    
    const servicesToDelete = matchingServices.filter(s => s.id !== mainService.id);
    console.log(`Urmează să ștergem ${servicesToDelete.length} servicii duplicate`);
    
    // Ștergem de la sfârșit la început pentru a nu strica indexarea
    const deleteIndices = servicesToDelete.map(s => s.rowIndex).sort((a, b) => b - a);
    
    for (const index of deleteIndices) {
      const service = servicesToDelete.find(s => s.rowIndex === index);
      console.log(`  Ștergere serviciu: ${service.id} (${service.nameNL})`);
      await servicesRows[index].delete();
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
          existingPrice.Price = expectedPrice;
          existingPrice.Currency = 'EUR';
          await existingPrice.save();
          pricesUpdated++;
          console.log(`  📊 Actualizat preț pentru ${bodyType}: ${expectedPrice} EUR`);
        }
      } else {
        // Creăm un nou rând de preț
        const newPriceRow = {
          ID: `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          Service_ID: mainService.id,
          Body_Type: bodyType,
          Price: expectedPrice,
          Currency: 'EUR',
          Duration_Minutes: 60,
          Is_Active: 'TRUE',
          Created_At: new Date().toISOString()
        };
        
        await pricesSheet.addRow(newPriceRow);
        pricesAdded++;
        console.log(`  ➕ Adăugat preț nou pentru ${bodyType}: ${expectedPrice} EUR`);
      }
    }
    
    console.log(`✅ Prețuri actualizate: ${pricesUpdated} modificate, ${pricesAdded} adăugate`);
    
    // Verificare finală
    console.log('\n🔍 Verificare finală...');
    
    const finalServicesRows = await servicesSheet.getRows();
    const finalPricesRows = await pricesSheet.getRows();
    
    console.log(`📊 Servicii finale: ${finalServicesRows.length}`);
    console.log(`💰 Prețuri finale: ${finalPricesRows.length}`);
    
    // Găsim serviciul nostru actualizat
    const updatedService = finalServicesRows.find(row => {
      const serviceId = row.ID;
      const serviceName = String(row.Name_NL || row.Name || '').toLowerCase().trim();
      return serviceId === mainService.id || serviceName.includes('interieurreiniging premium');
    });
    
    if (updatedService) {
      console.log('\n✅ Serviciu final:');
      console.log(`   ID: ${updatedService.ID}`);
      console.log(`   Nume: ${updatedService.Name_NL || updatedService.Name}`);
      console.log(`   Categorie: ${updatedService.Category_NL || updatedService.Category}`);
      console.log(`   Activ: ${updatedService.Is_Active}`);
      
      const finalPrices = finalPricesRows.filter(priceRow => 
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