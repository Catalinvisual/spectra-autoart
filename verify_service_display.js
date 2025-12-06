import dotenv from 'dotenv'
import { GoogleSheetsService } from './server/src/services/googleSheetsService.js';

// Load environment variables
dotenv.config({ path: '.env.local' })

async function verifyServiceDisplay() {
  console.log('🔍 === VERIFICARE AFIȘARE SERVICII ÎN ADMIN ===');
  const service = new GoogleSheetsService();
  
  try {
    console.log('📊 Initializare serviciu Google Sheets...');
    await service.initialize();
    
    console.log('\n📋 Obținere date servicii și prețuri...');
    const servicesData = await service.getData('Vehicle_Services');
    const pricesData = await service.getData('Vehicle_Service_Prices');
    
    console.log(`✅ Găsite ${servicesData.length - 1} servicii și ${pricesData.length - 1} prețuri`);
    
    // Găsim serviciul "Interieurreiniging Premium" sau asemănător
    const targetServiceNames = ['interieurreiniging premium', 'eersteklas interieurreiniging', 'interieurreiniging'];
    let targetService = null;
    let targetServicePrices = [];
    
    for (let i = 1; i < servicesData.length; i++) {
      const row = servicesData[i];
      const serviceId = row[0];
      const serviceNameNL = String(row[3] || row[1] || '').toLowerCase().trim(); // Name_NL sau Name
      const serviceNameEN = String(row[2] || row[1] || '').toLowerCase().trim(); // Name_EN sau Name
      
      const isMatch = targetServiceNames.some(name => 
        serviceNameNL.includes(name) || serviceNameEN.includes(name)
      );
      
      if (isMatch) {
        targetService = {
          id: serviceId,
          nameNL: row[3] || row[1] || 'Unknown',
          nameEN: row[2] || row[1] || 'Unknown',
          description: row[7] || row[6] || row[5] || '',
          category: row[13] || row[12] || row[11] || 'Unknown',
          isActive: row[20] === 'true' || row[20] === true
        };
        
        // Găsim prețurile pentru acest serviciu
        targetServicePrices = pricesData.filter(priceRow => 
          String(priceRow[1] || '').trim() === String(serviceId).trim()
        );
        
        console.log(`\n🎯 Serviciu găsit:`);
        console.log(`   ID: ${targetService.id}`);
        console.log(`   Nume NL: ${targetService.nameNL}`);
        console.log(`   Nume EN: ${targetService.nameEN}`);
        console.log(`   Categorie: ${targetService.category}`);
        console.log(`   Activ: ${targetService.isActive}`);
        console.log(`   Prețuri găsite: ${targetServicePrices.length}`);
        
        break;
      }
    }
    
    if (!targetService) {
      console.log('\n❌ Nu a fost găsit niciun serviciu de tip "Interieurreiniging"');
      console.log('📋 Servicii disponibile:');
      
      for (let i = 1; i < Math.min(servicesData.length, 10); i++) {
        const row = servicesData[i];
        const serviceId = row[0];
        const serviceName = row[3] || row[2] || row[1] || 'Unknown';
        console.log(`   ${i}. ID: ${serviceId} - Nume: ${serviceName}`);
      }
      
      return;
    }
    
    // Analizăm prețurile pe tipuri de caroserie
    console.log('\n💰 Analiză prețuri pe tipuri de caroserie:');
    
    const bodyTypes = ['sedan', 'suv', 'hatchback', 'cabrio', 'coupe', 'wagon', 'van', 'break'];
    const pricesByBodyType = {};
    
    for (const bodyType of bodyTypes) {
      const priceRow = targetServicePrices.find(priceRow => {
        const bodyTypeFromPrice = String(priceRow[2] || '').toLowerCase().trim();
        return bodyTypeFromPrice === bodyType;
      });
      
      if (priceRow) {
        const price = parseFloat(priceRow[3] || 0);
        const currency = priceRow[4] || 'EUR';
        pricesByBodyType[bodyType] = { price, currency };
        console.log(`   🚗 ${bodyType}: ${price} ${currency}`);
      } else {
        pricesByBodyType[bodyType] = { price: 0, currency: 'EUR' };
        console.log(`   🚗 ${bodyType}: Nu există preț`);
      }
    }
    
    // Verificăm dacă prețurile sunt corecte
    console.log('\n🔍 Verificare prețuri așteptate vs actuale:');
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
    
    let hasPriceIssues = false;
    for (const [bodyType, expectedPrice] of Object.entries(expectedPrices)) {
      const actualPrice = pricesByBodyType[bodyType]?.price || 0;
      if (actualPrice !== expectedPrice) {
        console.log(`   ❌ ${bodyType}: Așteptat ${expectedPrice} EUR, Actual ${actualPrice} EUR`);
        hasPriceIssues = true;
      } else {
        console.log(`   ✅ ${bodyType}: ${actualPrice} EUR (corect)`);
      }
    }
    
    if (hasPriceIssues) {
      console.log('\n⚠️  Probleme de preț detectate!');
      console.log('💡 Soluție: Actualizăm prețurile cu valorile corecte');
      
      // Actualizăm prețurile
      for (const [bodyType, expectedPrice] of Object.entries(expectedPrices)) {
        const existingPriceRow = targetServicePrices.find(priceRow => 
          String(priceRow[2] || '').toLowerCase().trim() === bodyType
        );
        
        if (existingPriceRow) {
          // Actualizăm prețul existent
          existingPriceRow[3] = expectedPrice;
          existingPriceRow[4] = 'EUR';
          console.log(`   📊 Actualizat preț pentru ${bodyType}: ${expectedPrice} EUR`);
        } else {
          // Creăm un nou rând de preț
          const newPriceRow = [
            `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID
            targetService.id, // Service_ID
            bodyType, // Body_Type
            expectedPrice, // Price
            'EUR', // Currency
            60, // Duration_Minutes
            'TRUE', // Is_Active
            new Date().toISOString() // Created_At
          ];
          
          // Adăugăm la sfârșitul datelor
          pricesData.push(newPriceRow);
          console.log(`   ➕ Adăugat preț nou pentru ${bodyType}: ${expectedPrice} EUR`);
        }
      }
      
      // Salvăm modificările
      console.log('\n💾 Salvare modificări în Google Sheets...');
      await service.updateData('Vehicle_Service_Prices', 1, pricesData.slice(1));
      console.log('✅ Prețuri actualizate cu succes!');
      
    } else {
      console.log('\n✅ Toate prețurile sunt corecte!');
    }
    
    // Verificare finală
    console.log('\n🔍 Verificare finală:');
    const finalPricesData = await service.getData('Vehicle_Service_Prices');
    const finalServicePrices = finalPricesData.filter(priceRow => 
      String(priceRow[1] || '').trim() === String(targetService.id).trim()
    );
    
    console.log(`✅ Serviciu: ${targetService.nameNL}`);
    console.log(`✅ Prețuri finale: ${finalServicePrices.length}`);
    
    for (const bodyType of bodyTypes) {
      const priceRow = finalServicePrices.find(priceRow => 
        String(priceRow[2] || '').toLowerCase().trim() === bodyType
      );
      
      if (priceRow) {
        const price = parseFloat(priceRow[3] || 0);
        console.log(`   🚗 ${bodyType}: ${price} EUR`);
      }
    }
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Rulează scriptul
verifyServiceDisplay().then(() => {
  console.log('\n🎉 Verificare completată cu succes!');
  process.exit(0);
}).catch(err => {
  console.error('\n💥 Verificare eșuată:', err);
  process.exit(1);
});