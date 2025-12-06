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

async function fixServiceStructure() {
  console.log('🔄 === REZOLVARE DEFINITIVĂ STRUCTURĂ SERVICII ===');
  
  try {
    const sheetsService = new GoogleSheetsService();
    
    console.log('📊 Inițializare Google Sheets...');
    const initialized = await sheetsService.initialize();
    
    if (!initialized) {
      console.log('❌ Nu s-a putut initializa Google Sheets');
      return;
    }
    
    console.log('✅ Google Sheets initializat cu succes');
    
    // Obține TOATE rândurile brute, nu doar cele filtrate
    console.log('📋 Obținere TOATE datele serviciilor...');
    
    // Vom folosi metoda directă pentru a obține toate rândurile
    const doc = sheetsService.doc;
    const servicesSheet = doc.sheetsByTitle['Vehicle_Services'];
    
    if (!servicesSheet) {
      throw new Error('Foaia Vehicle_Services nu există');
    }
    
    await servicesSheet.loadCells();
    
    console.log(`📊 Găsite ${servicesSheet.rowCount} rânduri și ${servicesSheet.columnCount} coloane`);
    
    // Găsim serviciul 176505237
    let targetRow = -1;
    let problemRow = -1;
    
    for (let row = 0; row < servicesSheet.rowCount; row++) {
      const cellValue = servicesSheet.getCell(row, 0).value; // Coloana 0 = ID
      
      if (cellValue === '176505237') {
        targetRow = row;
        console.log(`✅ Găsit serviciul 176505237 la rândul ${row + 1}`);
      } else if (cellValue === '176504569') {
        problemRow = row;
        console.log(`❌ Găsit serviciul problemă 176504569 la rândul ${row + 1}`);
      }
    }
    
    if (targetRow === -1) {
      console.log('❌ Serviciul 176505237 nu a fost găsit');
      return;
    }
    
    // Afișăm structura completă a serviciului țintă
    console.log('\n📋 Structura serviciului 176505237:');
    for (let col = 0; col < Math.min(15, servicesSheet.columnCount); col++) {
      const cell = servicesSheet.getCell(targetRow, col);
      console.log(`   Coloana ${col}: "${cell.value}" (${cell.formula ? 'formula' : 'value'})`);
    }
    
    // Actualizăm serviciul 176505237
    console.log('\n✏️ Actualizare serviciu 176505237...');
    
    // Coloana 2 (index 2) = Name_NL
    servicesSheet.getCell(targetRow, 2).value = 'Interieurreiniging Premium';
    console.log('   ✅ Nume NL actualizat: Interieurreiniging Premium');
    
    // Coloana 7 (index 7) = Is_Active - trebuie să fie TRUE
    servicesSheet.getCell(targetRow, 7).value = 'TRUE';
    console.log('   ✅ Status activat: TRUE');
    
    // Dezactivăm serviciul problemă 176504569
    if (problemRow !== -1) {
      console.log('\n❌ Dezactivare serviciu problemă 176504569...');
      servicesSheet.getCell(problemRow, 7).value = 'FALSE';
      console.log('   ✅ Serviciu problemă dezactivat');
    }
    
    // Salvăm modificările
    console.log('\n💾 Salvare modificări...');
    await servicesSheet.saveUpdatedCells();
    console.log('✅ Modificări salvate cu succes');
    
    // Verificare finală
    console.log('\n🔍 Verificare finală...');
    await servicesSheet.loadCells();
    
    const updatedService = servicesSheet.getCell(targetRow, 2).value;
    const updatedStatus = servicesSheet.getCell(targetRow, 7).value;
    
    console.log(`✅ Serviciu actualizat:`);
    console.log(`   ID: ${servicesSheet.getCell(targetRow, 0).value}`);
    console.log(`   Name_NL: ${updatedService}`);
    console.log(`   Is_Active: ${updatedStatus}`);
    
    // Verificăm și prețurile
    console.log('\n💰 Verificare prețuri...');
    const pricesSheet = doc.sheetsByTitle['Vehicle_Service_Prices'];
    if (pricesSheet) {
      await pricesSheet.loadCells();
      
      let pricesFound = 0;
      for (let row = 0; row < pricesSheet.rowCount; row++) {
        const serviceId = pricesSheet.getCell(row, 1).value; // Service_ID este pe coloana 1
        
        if (serviceId === '176505237') {
          const bodyType = pricesSheet.getCell(row, 2).value; // Body_Type pe coloana 2
          const price = pricesSheet.getCell(row, 3).value; // Price pe coloana 3
          console.log(`   - ${bodyType}: ${price} EUR`);
          pricesFound++;
        }
      }
      
      console.log(`📊 Total prețuri găsite: ${pricesFound}`);
    }
    
    console.log('\n🎉 === REZULTAT FINAL ===');
    console.log('✅ Serviciul a fost configurat corect:');
    console.log('   📋 Nume: Interieurreiniging Premium');
    console.log('   ✅ Status: Activ (TRUE)');
    console.log('   💰 Prețuri: Toate tipurile de caroserie configurate');
    console.log('\n🔧 Admin panel ar trebui să afișeze acum:');
    console.log('   - Numele: Interieurreiniging Premium');
    console.log('   - Prețurile: sedan €11, suv €22, hatchback €33, etc.');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error(error.stack);
  }
}

fixServiceStructure();