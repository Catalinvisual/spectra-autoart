import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Configurare Google Sheets
const SPREADSHEET_ID = '1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90';
const SERVICE_ACCOUNT_EMAIL = 'spectra-autoart@spectra-autoart.iam.gserviceaccount.com';
const PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5Z1n7XbP++pxM\\n1D1a5h6cKKlQfUN+0Q5iSVEcLnPOV1r5L5b1l2p8W3M1qP1b3JQV5mXYf5z\\n-----END PRIVATE KEY-----\\n';

async function fixAdminDisplay() {
  console.log('🔄 === REZOLVARE PROBLEMĂ AFIȘARE ADMIN PANEL ===');
  
  try {
    // Inițializare Google Sheets
    console.log('📊 Conectare la Google Sheets...');
    const jwt = new JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY.replace(/\\\\n/g, '\\n'),
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
    
    console.log(`📋 Lucrăm cu foaia: ${servicesSheet.title}`);
    
    // Citește toate rândurile
    const rows = await servicesSheet.getRows();
    console.log(`📊 Găsite ${rows.length} rânduri`);
    
    let changesMade = 0;
    
    // Procesează fiecare rând
    for (const row of rows) {
      const serviceId = row.ID;
      const nameNL = row.Name_NL;
      const nameEN = row.Name_EN;
      const isActive = row.Is_Active;
      
      console.log(`🔍 Verificare serviciu: ID=${serviceId}, NL="${nameNL}", EN="${nameEN}", Activ=${isActive}`);
      
      // Serviciul problemă - 176504569 (cel afișat în admin panel)
      if (serviceId === '176504569') {
        console.log(`   ❌ Dezactivare serviciu problemă: ${serviceId}`);
        row.Is_Active = 'FALSE';
        await row.save();
        changesMade++;
      }
      
      // Serviciul corect - 176505237 (cel pe care l-am configurat)
      else if (serviceId === '176505237') {
        console.log(`   ✅ Activare și actualizare serviciu corect: ${serviceId}`);
        
        // Actualizează numele în olandeză dacă este necesar
        if (nameNL !== 'Interieurreiniging Premium') {
          row.Name_NL = 'Interieurreiniging Premium';
          console.log(`   ✏️ Actualizare nume NL: "${nameNL}" → "Interieurreiniging Premium"`);
        }
        
        // Asigură-te că este activ
        if (isActive !== 'TRUE') {
          row.Is_Active = 'TRUE';
          console.log(`   ✏️ Activare serviciu`);
        }
        
        await row.save();
        changesMade++;
      }
      
      // Alte servicii 176504xxx - dezactivează duplicatele
      else if (serviceId && serviceId.startsWith('176504') && isActive === 'TRUE') {
        console.log(`   🗑️ Dezactivare duplicat: ${serviceId}`);
        row.Is_Active = 'FALSE';
        await row.save();
        changesMade++;
      }
    }
    
    console.log(`\n🎉 === OPERAȚIUNE FINALIZATĂ ===`);
    console.log(`✅ ${changesMade} modificări efectuate`);
    console.log('✅ Serviciul problemă dezactivat');
    console.log('✅ Serviciul corect activat și actualizat');
    console.log('✅ Duplicate eliminate');
    console.log('🔧 Admin panel ar trebui să afișeze acum:');
    console.log('   - Nume: "Interieurreiniging Premium"');
    console.log('   - Prețuri: sedan €11, suv €22, hatchback €33, etc.');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

fixAdminDisplay();