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

async function checkServicePricesStructure() {
  console.log('🔍 === VERIFICARE STRUCTURĂ Vehicle_Service_Prices ===');
  
  try {
    const sheetsService = new GoogleSheetsService();
    
    console.log('📊 Inițializare Google Sheets...');
    const initialized = await sheetsService.initialize();
    
    if (!initialized) {
      console.log('❌ Nu s-a putut initializa Google Sheets');
      return;
    }
    
    console.log('✅ Google Sheets initializat cu succes');
    
    const doc = sheetsService.doc;
    const pricesSheet = doc.sheetsByTitle['Vehicle_Service_Prices'];
    
    if (!pricesSheet) {
      throw new Error('Foaia Vehicle_Service_Prices nu există');
    }
    
    await pricesSheet.loadCells();
    
    console.log(`📊 Găsite ${pricesSheet.rowCount} rânduri și ${pricesSheet.columnCount} coloane`);
    
    // Afișăm header-urile (primul rând)
    console.log('\n📋 HEADERE Vehicle_Service_Prices:');
    console.log('=====================================');
    
    for (let col = 0; col < Math.min(15, pricesSheet.columnCount); col++) {
      const headerCell = pricesSheet.getCell(0, col);
      if (headerCell.value) {
        console.log(`Coloana ${col}: "${headerCell.value}"`);
      }
    }
    
    // Căutăm serviciul 176505237 în prețuri
    console.log('\n🔍 CĂUTARE SERVICIU 176505237 în prețuri:');
    console.log('=========================================');
    
    let foundPrices = 0;
    
    for (let row = 1; row < pricesSheet.rowCount; row++) {
      const serviceIdCell = pricesSheet.getCell(row, 1); // Service_ID ar trebui să fie coloana 1
      
      if (serviceIdCell.value === '176505237') {
        foundPrices++;
        console.log(`\n✅ Preț găsit la rândul ${row + 1}:`);
        
        // Afișăm primele 10 coloane pentru acest rând
        for (let col = 0; col < Math.min(10, pricesSheet.columnCount); col++) {
          const cell = pricesSheet.getCell(row, col);
          if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
            const header = pricesSheet.getCell(0, col).value || `Coloana ${col}`;
            console.log(`   ${header}: "${cell.value}"`);
          }
        }
      }
    }
    
    if (foundPrices === 0) {
      console.log('❌ Nicun preț găsit pentru serviciul 176505237');
    } else {
      console.log(`\n📊 Total prețuri găsite: ${foundPrices}`);
    }
    
    // Afișăm câteva exemple de prețuri pentru alte servicii
    console.log('\n📋 EXEMPLE de prețuri din Vehicle_Service_Prices:');
    console.log('=================================================');
    
    let exampleCount = 0;
    for (let row = 1; row < pricesSheet.rowCount && exampleCount < 5; row++) {
      const serviceIdCell = pricesSheet.getCell(row, 1);
      if (serviceIdCell.value && serviceIdCell.value !== '176505237') {
        exampleCount++;
        console.log(`\nExemplu ${exampleCount} (rând ${row + 1}):`);
        
        for (let col = 0; col < Math.min(8, pricesSheet.columnCount); col++) {
          const cell = pricesSheet.getCell(row, col);
          if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
            const header = pricesSheet.getCell(0, col).value || `Coloana ${col}`;
            console.log(`   ${header}: "${cell.value}"`);
          }
        }
      }
    }
    
    console.log('\n🎉 === VERIFICARE FINALIZATĂ ===');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error(error.stack);
  }
}

checkServicePricesStructure();