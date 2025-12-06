import dotenv from 'dotenv'
import { GoogleSheetsService } from './server/src/services/googleSheetsService.js';

// Load environment variables
dotenv.config({ path: '.env.local' })

async function fixServiceDuplicates() {
  console.log('🧹 === CURĂȚARE ȘI REZOLVARE DUPLICĂRI SERVICII ===');
  const service = new GoogleSheetsService();
  
  try {
    console.log('📊 Initializare serviciu Google Sheets...');
    await service.initialize();
    
    console.log('\n📋 Obținere date servicii...');
    const servicesData = await service.getData('Vehicle_Services');
    const pricesData = await service.getData('Vehicle_Service_Prices');
    
    console.log(`✅ Găsite ${servicesData.length - 1} servicii și ${pricesData.length - 1} prețuri`);
    
    // Identificăm duplicările după nume
    const serviceGroups = {};
    const headers = servicesData[0];
    
    // Grupăm serviciile după nume
    for (let i = 1; i < servicesData.length; i++) {
      const row = servicesData[i];
      const serviceId = row[0];
      const serviceName = row[headers.indexOf('Name_NL')] || row[headers.indexOf('Name')] || 'Unknown';
      const serviceNameEN = row[headers.indexOf('Name_EN')] || serviceName;
      
      const key = serviceName.toLowerCase().trim();
      if (!serviceGroups[key]) {
        serviceGroups[key] = [];
      }
      serviceGroups[key].push({
        id: serviceId,
        rowIndex: i,
        data: row,
        name: serviceName,
        nameEN: serviceNameEN
      });
    }
    
    console.log('\n🔍 Analiză duplicări:');
    let duplicatesFound = 0;
    let servicesToKeep = {};
    let servicesToDelete = [];
    
    for (const [key, group] of Object.entries(serviceGroups)) {
      if (group.length > 1) {
        duplicatesFound++;
        console.log(`\n❌ Duplicare găsită pentru "${key}": ${group.length} servicii`);
        
        // Păstrăm serviciul cu cele mai multe prețuri sau cel mai recent
        let bestService = group[0];
        let maxPrices = 0;
        
        for (const service of group) {
          const priceCount = pricesData.filter(row => 
            String(row[1] || '').trim() === String(service.id).trim()
          ).length;
          
          console.log(`  - ID: ${service.id} - ${priceCount} prețuri`);
          
          if (priceCount > maxPrices) {
            maxPrices = priceCount;
            bestService = service;
          }
        }
        
        console.log(`  ✅ Păstrăm: ${bestService.id} (${bestService.name})`);
        servicesToKeep[bestService.id] = bestService;
        
        // Marchează restul pentru ștergere
        for (const service of group) {
          if (service.id !== bestService.id) {
            servicesToDelete.push(service);
          }
        }
      } else {
        servicesToKeep[group[0].id] = group[0];
      }
    }
    
    if (duplicatesFound === 0) {
      console.log('✅ Nu au fost găsite duplicări');
      return;
    }
    
    console.log(`\n🗑️ Urmează să ștergem ${servicesToDelete.length} servicii duplicate`);
    console.log(`📌 Păstrăm ${Object.keys(servicesToKeep).length} servicii unice`);
    
    // Actualizăm prețurile să folosească ID-urile corecte
    console.log('\n💰 Actualizare prețuri cu ID-uri corecte...');
    let pricesUpdated = 0;
    
    for (let i = 1; i < pricesData.length; i++) {
      const priceRow = pricesData[i];
      const currentServiceId = String(priceRow[1] || '').trim();
      
      // Găsim serviciul original pentru acest preț
      let foundService = null;
      for (const [key, group] of Object.entries(serviceGroups)) {
        const service = group.find(s => s.id === currentServiceId);
        if (service) {
          // Găsim serviciul păstrat pentru acest grup
          const keptService = servicesToKeep[group.find(s => servicesToKeep[s.id])?.id];
          if (keptService && keptService.id !== currentServiceId) {
            console.log(`  📊 Actualizare preț: ${currentServiceId} -> ${keptService.id}`);
            priceRow[1] = keptService.id;
            pricesUpdated++;
          }
          break;
        }
      }
    }
    
    // Salvăm prețurile actualizate
    if (pricesUpdated > 0) {
      console.log(`\n💾 Salvare ${pricesUpdated} prețuri actualizate...`);
      await service.updateData('Vehicle_Service_Prices', 1, pricesData.slice(1));
      console.log('✅ Prețuri actualizate cu succes');
    }
    
    // Ștergem serviciile duplicate
    console.log('\n🗑️ Ștergere servicii duplicate...');
    
    // Sortăm descrescător după rowIndex pentru a șterge de jos în sus
    servicesToDelete.sort((a, b) => b.rowIndex - a.rowIndex);
    
    for (const service of servicesToDelete) {
      console.log(`  Ștergere serviciu: ${service.id} (${service.name})`);
      await service.deleteRow('Vehicle_Services', service.rowIndex + 1);
    }
    
    console.log('\n✅ === OPERAȚIUNE FINALIZATĂ ===');
    console.log(`🧹 Șterse ${servicesToDelete.length} servicii duplicate`);
    console.log(`💰 Actualizate ${pricesUpdated} prețuri`);
    console.log(`📋 Rămase ${Object.keys(servicesToKeep).length} servicii unice`);
    
    // Verificare finală
    console.log('\n🔍 Verificare finală...');
    const finalServicesData = await service.getData('Vehicle_Services');
    const finalPricesData = await service.getData('Vehicle_Service_Prices');
    
    console.log(`📊 Servicii finale: ${finalServicesData.length - 1}`);
    console.log(`💰 Prețuri finale: ${finalPricesData.length - 1}`);
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Rulează scriptul
fixServiceDuplicates().then(() => {
  console.log('\n🎉 Proces completat cu succes!');
  process.exit(0);
}).catch(err => {
  console.error('\n💥 Proces eșuat:', err);
  process.exit(1);
});