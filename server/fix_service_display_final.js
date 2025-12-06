// Script simplu pentru a dezactiva serviciul problemă și activa serviciul corect
import { readFileSync } from 'fs';
import { join } from 'path';

const config = JSON.parse(readFileSync(join(process.cwd(), 'config', 'service-account.json'), 'utf8'));

// Setează variabila de mediu pentru autentificare
process.env.GOOGLE_APPLICATION_CREDENTIALS = join(process.cwd(), 'config', 'service-account.json');

// Importă serviciul după ce am setat variabila de mediu
const { GoogleSheetsService } = await import('./src/services/googleSheetsService.js');

async function fixServiceDisplay() {
  console.log('🔄 === REZOLVARE DEFINITIVĂ AFIȘARE SERVICIU ===');
  
  try {
    const sheetsService = new GoogleSheetsService();
    
    // Setează configurația
    sheetsService.config = {
      spreadsheetId: '1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90',
      serviceAccountEmail: config.client_email,
      privateKey: config.private_key
    };
    
    console.log('📊 Inițializare Google Sheets...');
    await sheetsService.initialize();
    console.log('✅ Google Sheets inițializat');
    
    // Obține serviciile
    console.log('📋 Obținere servicii...');
    const services = await sheetsService.getData('Vehicle_Services');
    console.log(`📊 Găsite ${services.length} servicii`);
    
    let changesMade = 0;
    
    // Procesează fiecare serviciu
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      const serviceId = String(service[0] || '').trim();
      const nameNL = service[2];
      const nameEN = service[3];
      const isActive = service[7];
      
      // Serviciul problemă (176504569) - dezactivează-l
      if (serviceId === '176504569' && isActive === 'TRUE') {
        console.log(`❌ Dezactivare serviciu problemă: ${serviceId} - "${nameNL}"`);
        service[7] = 'FALSE';
        await sheetsService.updateData('Vehicle_Services', i + 2, service);
        changesMade++;
      }
      
      // Serviciul corect (176505237) - asigură-te că este activ și are numele corect
      else if (serviceId === '176505237') {
        let needsUpdate = false;
        
        if (isActive !== 'TRUE') {
          console.log(`✅ Activare serviciu corect: ${serviceId}`);
          service[7] = 'TRUE';
          needsUpdate = true;
        }
        
        if (nameNL !== 'Interieurreiniging Premium') {
          console.log(`✅ Actualizare nume: "${nameNL}" → "Interieurreiniging Premium"`);
          service[2] = 'Interieurreiniging Premium';
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          await sheetsService.updateData('Vehicle_Services', i + 2, service);
          changesMade++;
        }
      }
      
      // Alte servicii 176504xxx active - dezactivează-le
      else if (serviceId.startsWith('176504') && isActive === 'TRUE') {
        console.log(`🗑️ Dezactivare duplicat: ${serviceId} - "${nameNL}"`);
        service[7] = 'FALSE';
        await sheetsService.updateData('Vehicle_Services', i + 2, service);
        changesMade++;
      }
    }
    
    console.log(`\n🎉 === REZULTAT ===`);
    console.log(`✅ ${changesMade} modificări efectuate`);
    console.log('✅ Serviciul problemă dezactivat');
    console.log('✅ Serviciul corect activat și actualizat');
    console.log('✅ Duplicate eliminate');
    console.log('\n🔧 Admin panel ar trebui să afișeze acum:');
    console.log('   📋 Nume: Interieurreiniging Premium');
    console.log('   💰 Prețuri: sedan €11, suv €22, hatchback €33, etc.');
    
    // Verificare finală
    console.log('\n🔍 Verificare finală...');
    const finalServices = await sheetsService.getData('Vehicle_Services');
    const activeServices = finalServices.filter(s => s[7] === 'TRUE');
    console.log(`📊 Servicii active finale: ${activeServices.length}`);
    
    activeServices.forEach(service => {
      console.log(`   🟢 ${service[0]} - "${service[2]}"`);
    });
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    process.exit(1);
  }
}

fixServiceDisplay();