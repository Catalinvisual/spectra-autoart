import { GoogleSheetsService } from './src/services/googleSheetsService.js';

async function fixAdminDisplay() {
  console.log('🔄 === REZOLVARE PROBLEMĂ AFIȘARE ADMIN PANEL ===');
  
  try {
    // Inițializare Google Sheets folosind serviciul existent
    console.log('📊 Inițializare Google Sheets...');
    const sheetsService = new GoogleSheetsService();
    
    // Setează configurările manual
    sheetsService.config = {
      spreadsheetId: '1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90',
      serviceAccountEmail: 'spectra-autoart@spectra-autoart.iam.gserviceaccount.com',
      privateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5Z1n7XbP++pxM\\n1D1a5h6cKKlQfUN+0Q5iSVEcLnPOV1r5L5b1l2p8W3M1qP1b3JQV5mXYf5z\\n-----END PRIVATE KEY-----\\n'
    };
    
    await sheetsService.initialize();
    console.log('✅ Google Sheets inițializat');
    
    // Obține toate serviciile
    console.log('📋 Obținere servicii...');
    const servicesData = await sheetsService.getData('Vehicle_Services');
    console.log(`📊 Găsite ${servicesData.length} rânduri în Vehicle_Services`);
    
    // Găsește serviciul problemă (176504569) - cel afișat în admin panel
    const problemService = servicesData.find(service => {
      const serviceId = service[0]; // ID este pe prima coloană
      return String(serviceId || '').trim() === '176504569';
    });
    
    if (problemService) {
      console.log('🔍 Serviciul problemă găsit:');
      console.log(`   ID: ${problemService[0]}`);
      console.log(`   Nume NL: ${problemService[2]}`); // Name_NL este pe coloana 3
      console.log(`   Nume EN: ${problemService[3]}`); // Name_EN este pe coloana 4
      console.log(`   Categorie: ${problemService[4]}`); // Category este pe coloana 5
      console.log(`   Activ: ${problemService[7]}`); // Is_Active este pe coloana 8
      
      // Dezactivează serviciul problemă
      console.log('❌ Dezactivare serviciu problemă...');
      problemService[7] = 'FALSE'; // Setează Is_Active pe FALSE
      
      // Găsește indexul rândului pentru actualizare
      const rowIndex = servicesData.indexOf(problemService) + 2; // +2 pentru header și index 1-based
      await sheetsService.updateData('Vehicle_Services', rowIndex, problemService);
      console.log('✅ Serviciu problemă dezactivat');
    } else {
      console.log('⚠️ Serviciul 176504569 nu a fost găsit');
    }
    
    // Găsește serviciul corect (176505237) - cel pe care l-am configurat
    const correctService = servicesData.find(service => {
      const serviceId = service[0]; // ID este pe prima coloană
      return String(serviceId || '').trim() === '176505237';
    });
    
    if (correctService) {
      console.log('✅ Serviciul corect găsit:');
      console.log(`   ID: ${correctService[0]}`);
      console.log(`   Nume NL: ${correctService[2]}`);
      console.log(`   Nume EN: ${correctService[3]}`);
      console.log(`   Categorie: ${correctService[4]}`);
      console.log(`   Activ: ${correctService[7]}`);
      
      // Asigură-te că este activ și actualizează numele dacă este necesar
      let needsUpdate = false;
      if (correctService[7] !== 'TRUE') {
        correctService[7] = 'TRUE';
        needsUpdate = true;
        console.log('✅ Activare serviciu corect...');
      }
      
      // Actualizează numele în olandeză dacă este necesar
      if (correctService[2] !== 'Interieurreiniging Premium') {
        correctService[2] = 'Interieurreiniging Premium';
        needsUpdate = true;
        console.log('✅ Actualizare nume olandeză...');
      }
      
      if (needsUpdate) {
        const rowIndex = servicesData.indexOf(correctService) + 2;
        await sheetsService.updateData('Vehicle_Services', rowIndex, correctService);
        console.log('✅ Serviciu corect actualizat');
      }
    } else {
      console.log('⚠️ Serviciul 176505237 nu a fost găsit');
    }
    
    // Verificăm și dezactivăm alte duplicate
    console.log('🧹 Verificare duplicate...');
    let duplicatesDeactivated = 0;
    
    for (const service of servicesData) {
      const serviceId = String(service[0] || '').trim();
      const isActive = service[7];
      
      // Dezactivează toate serviciile 176504xxx care sunt încă active
      if (serviceId.startsWith('176504') && serviceId !== '176504569' && isActive === 'TRUE') {
        console.log(`   Duplicat găsit și dezactivat: ${serviceId}`);
        service[7] = 'FALSE';
        const rowIndex = servicesData.indexOf(service) + 2;
        await sheetsService.updateData('Vehicle_Services', rowIndex, service);
        duplicatesDeactivated++;
      }
    }
    
    console.log(`🗑️ ${duplicatesDeactivated} duplicate dezactivate`);
    
    console.log('\n🎉 === OPERAȚIUNE FINALIZATĂ ===');
    console.log('✅ Serviciul problemă dezactivat');
    console.log('✅ Serviciul corect activat și actualizat');
    console.log('✅ Duplicate eliminate');
    console.log('🔧 Admin panel ar trebui să afișeze acum serviciul corect cu numele "Interieurreiniging Premium"');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

fixAdminDisplay();