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

async function analyzeAllServices() {
  console.log('🔍 === ANALIZĂ COMPLETĂ SERVICII ===');
  
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
    
    // Căutăm serviciul specific adăugat de tine
    console.log('\n🔍 Căutare serviciu cu ID: service-1765031641956-765');
    
    const targetService = servicesData.find(service => 
      String(service.ID || '').trim() === 'service-1765031641956-765'
    );
    
    if (targetService) {
      console.log('✅ Serviciu găsit!');
      console.log(`   ID: ${targetService.ID}`);
      console.log(`   Nume: ${targetService.Name_NL || targetService.Name}`);
      console.log(`   Categorie: ${targetService.Category_NL || targetService.Category}`);
      console.log(`   Descriere: ${targetService.Description_NL || targetService.Description}`);
      console.log(`   Activ: ${targetService.Is_Active}`);
      
      // Găsim prețurile pentru acest serviciu
      const servicePrices = pricesData.filter(priceRow => 
        String(priceRow.Service_ID || '').trim() === 'service-1765031641956-765'
      );
      
      console.log(`   Prețuri găsite: ${servicePrices.length}`);
      
      if (servicePrices.length > 0) {
        console.log('   Detalii prețuri:');
        servicePrices.forEach((price, index) => {
          console.log(`     ${index + 1}. ${price.Body_Type}: ${price.Price} ${price.Currency}`);
        });
      }
    } else {
      console.log('❌ Serviciul cu ID-ul specificat nu a fost găsit');
    }
    
    // Căutăm toate serviciile care conțin "interieurreiniging" sau "interieur"
    console.log('\n🔍 Căutare toate serviciile cu "interieurreiniging" sau "interieur"');
    
    const interieurServices = [];
    
    servicesData.forEach((service, index) => {
      const serviceId = service.ID;
      const serviceNameNL = String(service.Name_NL || service.Name || '').toLowerCase().trim();
      const serviceNameEN = String(service.Name_EN || service.Name || '').toLowerCase().trim();
      const descriptionNL = String(service.Description_NL || service.Description || '').toLowerCase().trim();
      const descriptionEN = String(service.Description_EN || service.Description || '').toLowerCase().trim();
      
      const hasInterieur = 
        serviceNameNL.includes('interieurreiniging') ||
        serviceNameEN.includes('interieurreiniging') ||
        serviceNameNL.includes('interieur') ||
        serviceNameEN.includes('interieur') ||
        descriptionNL.includes('interieurreiniging') ||
        descriptionEN.includes('interieurreiniging') ||
        descriptionNL.includes('interieur') ||
        descriptionEN.includes('interieur');
      
      if (hasInterieur) {
        const servicePrices = pricesData.filter(priceRow => 
          String(priceRow.Service_ID || '').trim() === String(serviceId).trim()
        );
        
        interieurServices.push({
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
    
    if (interieurServices.length > 0) {
      console.log(`✅ Găsite ${interieurServices.length} servicii cu "interieur"`);
      
      interieurServices.forEach((service, index) => {
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
    } else {
      console.log('❌ Nu a fost găsit niciun serviciu cu "interieur"');
    }
    
    // Afișăm și primele 10 servicii pentru a vedea structura
    console.log('\n📋 Primele 10 servicii (pentru referință):');
    
    servicesData.slice(0, 10).forEach((service, index) => {
      console.log(`\n${index + 1}. ID: ${service.ID}`);
      console.log(`   Nume: ${service.Name_NL || service.Name}`);
      console.log(`   Categorie: ${service.Category_NL || service.Category}`);
      console.log(`   Activ: ${service.Is_Active}`);
    });
    
    console.log('\n✅ Analiză completă finalizată');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Rulează scriptul
analyzeAllServices().then(() => {
  console.log('\n🚀 Analiză finalizată!');
  process.exit(0);
}).catch(err => {
  console.error('\n💥 Analiză eșuată:', err);
  process.exit(1);
});