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

async function findAllServices() {
  console.log('🔍 === GĂSIRE TOATE SERVICIILE 176505 ===');
  
  try {
    const sheetsService = new GoogleSheetsService();
    
    console.log('📊 Inițializare Google Sheets...');
    const initialized = await sheetsService.initialize();
    
    if (!initialized) {
      console.log('❌ Nu s-a putut initializa Google Sheets');
      return;
    }
    
    console.log('✅ Google Sheets initializat cu succes');
    
    // Obține TOATE rândurile brute
    const doc = sheetsService.doc;
    const servicesSheet = doc.sheetsByTitle['Vehicle_Services'];
    
    if (!servicesSheet) {
      throw new Error('Foaia Vehicle_Services nu există');
    }
    
    await servicesSheet.loadCells();
    
    console.log(`📊 Găsite ${servicesSheet.rowCount} rânduri și ${servicesSheet.columnCount} coloane`);
    
    // Căutăm toate serviciile care conțin "176505"
    const foundServices = [];
    
    for (let row = 0; row < servicesSheet.rowCount; row++) {
      const cellValue = servicesSheet.getCell(row, 0).value; // Coloana 0 = ID
      
      if (cellValue && String(cellValue).includes('176505')) {
        foundServices.push({
          row: row + 1,
          id: cellValue,
          data: []
        });
        
        // Afișăm primele 15 coloane pentru a înțelege structura
        for (let col = 0; col < Math.min(15, servicesSheet.columnCount); col++) {
          const cell = servicesSheet.getCell(row, col);
          foundServices[foundServices.length - 1].data.push(cell.value);
        }
      }
    }
    
    console.log(`\n🔍 Găsite ${foundServices.length} servicii cu "176505":`);
    
    foundServices.forEach((service, index) => {
      console.log(`\n${index + 1}. Serviciu la rândul ${service.row}:`);
      console.log(`   ID: ${service.id}`);
      service.data.forEach((value, colIndex) => {
        if (value !== null && value !== undefined && value !== '') {
          console.log(`   Coloana ${colIndex}: "${value}"`);
        }
      });
    });
    
    // Identificăm serviciul corect
    const targetService = foundServices.find(s => s.id === '176505237');
    if (targetService) {
      console.log(`\n✅ Serviciul țintă (176505237) găsit la rândul ${targetService.row}`);
      
      // Actualizăm serviciul
      console.log('\n✏️ Actualizare serviciu...');
      
      const rowIndex = targetService.row - 1; // 0-based index
      
      // Identificăm coloanele importante
      let nameNLCol = -1;
      let isActiveCol = -1;
      
      // Căutăm coloanele după conținut
      for (let col = 0; col < servicesSheet.columnCount; col++) {
        const cellValue = servicesSheet.getCell(rowIndex, col).value;
        
        // Dacă găsim celula cu numele olandez, aceasta este coloana Name_NL
        if (cellValue === 'Premium interior cleaning') {
          nameNLCol = col;
        }
        // Dacă găsim celula cu statusul, aceasta este coloana Is_Active
        if (cellValue === 'true' || cellValue === 'TRUE' || cellValue === 'Grondige stofzuigbeurt van stoelen') {
          isActiveCol = col;
        }
      }
      
      console.log(`   📍 Name_NL găsit la coloana ${nameNLCol}`);
      console.log(`   📍 Is_Active găsit la coloana ${isActiveCol}`);
      
      // Actualizăm doar dacă am găsit coloanele
      if (nameNLCol !== -1) {
        servicesSheet.getCell(rowIndex, nameNLCol).value = 'Interieurreiniging Premium';
        console.log('   ✅ Nume NL actualizat: Interieurreiniging Premium');
      }
      
      if (isActiveCol !== -1) {
        servicesSheet.getCell(rowIndex, isActiveCol).value = 'TRUE';
        console.log('   ✅ Status activat: TRUE');
      }
      
      // Salvăm modificările
      console.log('\n💾 Salvare modificări...');
      await servicesSheet.saveUpdatedCells();
      console.log('✅ Modificări salvate cu succes');
      
      // Verificare finală
      console.log('\n🔍 Verificare finală...');
      await servicesSheet.loadCells();
      
      const updatedName = servicesSheet.getCell(rowIndex, nameNLCol).value;
      const updatedStatus = servicesSheet.getCell(rowIndex, isActiveCol).value;
      
      console.log(`✅ Serviciu actualizat:`);
      console.log(`   ID: ${servicesSheet.getCell(rowIndex, 0).value}`);
      console.log(`   Name_NL: ${updatedName}`);
      console.log(`   Is_Active: ${updatedStatus}`);
      
    } else {
      console.log('❌ Serviciul 176505237 nu a fost găsit în lista de servicii');
    }
    
    console.log('\n🎉 === OPERAȚIUNE FINALIZATĂ ===');
    console.log('✅ Serviciul a fost configurat corect');
    console.log('🔧 Admin panel ar trebui să afișeze acum serviciul corect');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error(error.stack);
  }
}

findAllServices();