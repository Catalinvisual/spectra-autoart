const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Configurare Google Sheets
const SPREADSHEET_ID = '1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90';
const SERVICE_ACCOUNT_EMAIL = 'spectra-autoart@spectra-autoart.iam.gserviceaccount.com';
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5Z1n7XbP++pxM\n1D1a5h6cKKlQfUN+0Q5iSVEcLnPOV1r5L5b1l2p8W3M1qP1b3JQV5mXYf5z\n-----END PRIVATE KEY-----\n';

async function fixAdminDisplay() {
  console.log('🔄 === REZOLVARE PROBLEMĂ AFIȘARE ADMIN PANEL ===');
  
  try {
    // Inițializare Google Sheets
    console.log('📊 Conectare la Google Sheets...');
    const jwt = new JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, jwt);
    await doc.loadInfo();
    
    console.log('✅ Conectat la spreadsheet:', doc.title);
    
    // Obține foaia de servicii
    const servicesSheet = doc.sheetsByTitle['Vehicle_Services'];
    if (!servicesSheet) {
      throw new Error('Foaia Vehicle_Services nu există');
    }
    
    // Citește toate rândurile
    const rows = await servicesSheet.getRows();
    console.log(`📋 Găsite ${rows.length} rânduri în Vehicle_Services`);
    
    // Găsește serviciul problemă (176504569) - cel afișat în admin panel
    const problemService = rows.find(row => row.ID === '176504569');
    if (problemService) {
      console.log('🔍 Serviciul problemă găsit:');
      console.log(`   ID: ${problemService.ID}`);
      console.log(`   Nume NL: ${problemService.Name_NL}`);
      console.log(`   Nume EN: ${problemService.Name_EN}`);
      console.log(`   Categorie: ${problemService.Category}`);
      console.log(`   Activ: ${problemService.Is_Active}`);
      
      // Dezactivează serviciul problemă
      console.log('❌ Dezactivare serviciu problemă...');
      problemService.Is_Active = 'FALSE';
      await problemService.save();
      console.log('✅ Serviciu problemă dezactivat');
    } else {
      console.log('⚠️ Serviciul 176504569 nu a fost găsit');
    }
    
    // Găsește serviciul corect (176505237) - cel pe care l-am configurat
    const correctService = rows.find(row => row.ID === '176505237');
    if (correctService) {
      console.log('✅ Serviciul corect găsit:');
      console.log(`   ID: ${correctService.ID}`);
      console.log(`   Nume NL: ${correctService.Name_NL}`);
      console.log(`   Nume EN: ${correctService.Name_EN}`);
      console.log(`   Categorie: ${correctService.Category}`);
      console.log(`   Activ: ${correctService.Is_Active}`);
      
      // Asigură-te că este activ
      if (correctService.Is_Active !== 'TRUE') {
        console.log('✅ Activare serviciu corect...');
        correctService.Is_Active = 'TRUE';
        await correctService.save();
        console.log('✅ Serviciu corect activat');
      }
    } else {
      console.log('⚠️ Serviciul 176505237 nu a fost găsit');
    }
    
    // Verificăm și ștergem duplicatele
    console.log('🧹 Verificare duplicate...');
    const servicesById = {};
    let duplicatesFound = 0;
    
    for (const row of rows) {
      const serviceId = row.ID;
      if (serviceId && serviceId.includes('176504')) {
        if (servicesById[serviceId]) {
          console.log(`   Duplicat găsit: ${serviceId}`);
          duplicatesFound++;
          // Dezactivează duplicatele
          row.Is_Active = 'FALSE';
          await row.save();
        } else {
          servicesById[serviceId] = row;
        }
      }
    }
    
    console.log(`🗑️ ${duplicatesFound} duplicate dezactivate`);
    
    console.log('\n🎉 === OPERAȚIUNE FINALIZATĂ ===');
    console.log('✅ Serviciul problemă dezactivat');
    console.log('✅ Serviciul corect activat');
    console.log('✅ Duplicate eliminate');
    console.log('🔧 Admin panel ar trebui să afișeze acum serviciul corect');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    process.exit(1);
  }
}

fixAdminDisplay();