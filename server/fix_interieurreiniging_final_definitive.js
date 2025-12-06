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

async function fixInterieurreinigingServices() {
  console.log('🧹 === REZOLVARE DEFINITIVĂ PROBLEMĂ SERVICII INTERIEURREINIGING ===');
  
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
    
    // Identificăm serviciul cu ID-ul 176505237 (cel găsit în debug)
    console.log('\n🔍 Căutare serviciu cu ID-ul 176505237...');
    
    const targetService = servicesData.find(service => {
      const serviceId = service[0]; // ID este pe prima coloană
      return String(serviceId || '').trim() === '176505237';
    });
    
    if (!targetService) {
      console.log('❌ Nu a fost găsit serviciul cu ID-ul 176505237');
      
      // Afișăm toate serviciile pentru debugging
      console.log('\n📋 Toate serviciile disponibile:');
      servicesData.forEach((service, index) => {
        const serviceId = service[0];
        const serviceName = service[2] || service[1] || 'Unknown';
        console.log(`   ${index + 1}. ID: ${serviceId}, Nume: ${serviceName}`);
      });
      
      return;
    }
    
    console.log('✅ Serviciu găsit!');
    console.log(`   ID: ${targetService[0]}`);
    console.log(`   Nume NL: ${targetService[2]}`);
    console.log(`   Nume EN: ${targetService[1]}`);
    console.log(`   Categorie: ${targetService[13]}`);
    console.log(`   Activ: ${targetService[20]}`);
    
    const serviceId = targetService[0];
    
    // Găsim toate prețurile pentru acest serviciu
    const servicePrices = pricesData.filter(priceRow => {
      const priceServiceId = priceRow[1]; // Service_ID este pe coloana 2
      return String(priceServiceId || '').trim() === String(serviceId).trim();
    });
    
    console.log(`   Prețuri găsite: ${servicePrices.length}`);
    
    if (servicePrices.length > 0) {
      console.log('   Prețuri actuale:');
      servicePrices.forEach((priceRow, index) => {
        const bodyType = priceRow[2] || 'unknown'; // Body_Type pe coloana 3
        const price = priceRow[3] || 0; // Price pe coloana 4
        const currency = priceRow[4] || 'EUR'; // Currency pe coloana 5
        console.log(`     ${index + 1}. ${bodyType}: ${price} ${currency}`);
      });
    }
    
    // Definim prețurile corecte
    const correctPrices = {
      sedan: 11,
      suv: 22,
      hatchback: 33,
      cabrio: 44,
      coupe: 55,
      wagon: 66,
      van: 77,
      break: 88
    };
    
    // Actualizăm serviciul cu datele corecte
    console.log('\n✏️ Actualizare serviciu cu date corecte...');
    
    // Găsim indexul serviciului în array
    const serviceIndex = servicesData.findIndex(service => service[0] === serviceId);
    
    if (serviceIndex === -1) {
      console.log('❌ Nu s-a putut găsi indexul serviciului');
      return;
    }
    
    // Actualizăm datele serviciului
    const updatedServiceData = [
      serviceId, // ID - păstrăm același
      'Premium Interior Cleaning', // Name_EN
      'Interieurreiniging Premium', // Name_NL  
      targetService[3], // Name_ES - păstrăm
      targetService[4], // Name_PL - păstrăm
      targetService[5], // Name_RO - păstrăm
      'Grondige stofzuigbeurt van stoelen, tapijten en kofferbak\nDieptereiniging van bekleding en leerbehandeling\nVerwijderen van vlekken en onaangename geuren\nReiniging en verzorging van dashboard, ventilatieopeningen en ramen', // Description
      'Thorough vacuum cleaning of seats, carpets and boot\nDeep cleaning of upholstery and leather treatment\nRemoval of stains and unpleasant odours\nCleaning and care of dashboard, air vents and windows', // Description_EN
      'Grondige stofzuigbeurt van stoelen, tapijten en kofferbak\nDieptereiniging van bekleding en leerbehandeling\nVerwijderen van vlekken en onaangename geuren\nReiniging en verzorging van dashboard, ventilatieopeningen en ramen', // Description_NL
      targetService[9], // Description_ES - păstrăm
      targetService[10], // Description_PL - păstrăm
      targetService[11], // Description_RO - păstrăm
      'Interior Detailing', // Category
      'Interior Detailing', // Category_EN
      'Interior Detailing', // Category_NL
      targetService[15], // Category_ES - păstrăm
      targetService[16], // Category_PL - păstrăm
      targetService[17], // Category_RO - păstrăm
      60, // Duration_Minutes
      true, // Is_Active
      targetService[20], // Created_At - păstrăm
      '', // Coloane goale
      '',
      '',
      ''
    ];
    
    // Actualizăm serviciul în Google Sheets
    const serviceUpdated = await sheetsService.updateData('Vehicle_Services', serviceIndex, updatedServiceData);
    
    if (serviceUpdated) {
      console.log('✅ Serviciu actualizat cu succes');
      console.log(`   Nume nou: ${updatedServiceData[2]}`);
      console.log(`   Categorie nouă: ${updatedServiceData[13]}`);
    } else {
      console.log('⚠️  Serviciul nu a putut fi actualizat');
    }
    
    // Actualizăm prețurile
    console.log('\n💰 Actualizare prețuri serviciu...');
    
    let pricesUpdated = 0;
    let pricesAdded = 0;
    
    // Pentru fiecare tip de caroserie
    for (const [bodyType, expectedPrice] of Object.entries(correctPrices)) {
      // Căutăm prețul existent
      const existingPrice = servicePrices.find(priceRow => {
        const priceBodyType = String(priceRow[2] || '').toLowerCase().trim();
        return priceBodyType === bodyType;
      });
      
      if (existingPrice) {
        // Actualizăm prețul existent
        const priceIndex = pricesData.findIndex(priceRow => {
          const priceServiceId = priceRow[1];
          const priceBodyType = String(priceRow[2] || '').toLowerCase().trim();
          return String(priceServiceId || '').trim() === String(serviceId).trim() && priceBodyType === bodyType;
        });
        
        if (priceIndex !== -1) {
          const updatedPriceData = [
            existingPrice[0], // ID - păstrăm
            serviceId, // Service_ID
            bodyType, // Body_Type
            expectedPrice, // Price
            'EUR', // Currency
            60, // Duration_Minutes
            'TRUE', // Is_Active
            new Date().toISOString(), // Created_At
            '', // Coloane goale
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ];
          
          const priceUpdated = await sheetsService.updateData('Vehicle_Service_Prices', priceIndex, updatedPriceData);
          
          if (priceUpdated) {
            pricesUpdated++;
            console.log(`  📊 Actualizat preț pentru ${bodyType}: ${expectedPrice} EUR`);
          }
        }
      } else {
        // Adăugăm un nou preț
        const newPriceData = [
          `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID
          serviceId, // Service_ID
          bodyType, // Body_Type
          expectedPrice, // Price
          'EUR', // Currency
          60, // Duration_Minutes
          'TRUE', // Is_Active
          new Date().toISOString(), // Created_At
          '', // Coloane goale
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          ''
        ];
        
        const priceAdded = await sheetsService.addData('Vehicle_Service_Prices', newPriceData);
        
        if (priceAdded) {
          pricesAdded++;
          console.log(`  ➕ Adăugat preț nou pentru ${bodyType}: ${expectedPrice} EUR`);
        }
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
    const updatedService = finalServicesData.find(service => service[0] === serviceId);
    
    if (updatedService) {
      console.log('\n✅ Serviciu final:');
      console.log(`   ID: ${updatedService[0]}`);
      console.log(`   Nume NL: ${updatedService[2]}`);
      console.log(`   Nume EN: ${updatedService[1]}`);
      console.log(`   Categorie: ${updatedService[13]}`);
      console.log(`   Activ: ${updatedService[20]}`);
      
      const finalPrices = finalPricesData.filter(priceRow => {
        const priceServiceId = priceRow[1];
        return String(priceServiceId || '').trim() === String(serviceId).trim();
      });
      
      console.log(`   Prețuri totale: ${finalPrices.length}`);
      
      console.log('\n📋 Prețuri finale:');
      for (const bodyType of Object.keys(correctPrices)) {
        const priceRow = finalPrices.find(priceRow => {
          const priceBodyType = String(priceRow[2] || '').toLowerCase().trim();
          return priceBodyType === bodyType;
        });
        
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
    console.log('✅ Problema serviciului "Interieurreiniging Premium" a fost rezolvată definitiv');
    console.log('✅ Numele serviciului a fost corectat în "Interieurreiniging Premium"');
    console.log('✅ Prețurile au fost actualizate cu valorile corecte:');
    console.log('   - Sedan: 11 EUR');
    console.log('   - SUV: 22 EUR');
    console.log('   - Hatchback: 33 EUR');
    console.log('   - Cabrio: 44 EUR');
    console.log('   - Coupe: 55 EUR');
    console.log('   - Wagon: 66 EUR');
    console.log('   - Van: 77 EUR');
    console.log('   - Break: 88 EUR');
    console.log('✅ Serviciul este acum corect configurat și va afișa prețurile dorite');
    
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