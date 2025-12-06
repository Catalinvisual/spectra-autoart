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

async function analyzeColumn6() {
  console.log('🔍 === ANALIZĂ COLOANA 6 din Vehicle_Service_Prices ===');
  
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
    
    // Analizăm conținutul coloanei 6
    console.log('\n📋 ANALIZĂ COLOANĂ 6:');
    console.log('=====================');
    
    let emptyCount = 0;
    let withDataCount = 0;
    const sampleData = [];
    
    for (let row = 0; row < Math.min(50, pricesSheet.rowCount); row++) {
      const cell = pricesSheet.getCell(row, 6);
      const value = cell.value;
      
      if (row === 0) {
        // Header row
        console.log(`Rând 1 (Header): "${value || 'GOALĂ'}"`);
      } else {
        if (value === null || value === undefined || value === '') {
          emptyCount++;
        } else {
          withDataCount++;
          if (sampleData.length < 10) {
            sampleData.push({ row: row + 1, value: value });
          }
        }
      }
    }
    
    console.log(`\n📊 Statistică primele 50 rânduri:`);
    console.log(`   Rânduri goale: ${emptyCount}`);
    console.log(`   Rânduri cu date: ${withDataCount}`);
    
    if (sampleData.length > 0) {
      console.log(`\n🔍 Exemple de date din coloana 6:`);
      sampleData.forEach(sample => {
        console.log(`   Rând ${sample.row}: "${sample.value}"`);
      });
    }
    
    // Verificăm dacă există un pattern sau formulă
    console.log('\n🔍 VERIFICARE PATTERN-URI:');
    console.log('===========================');
    
    // Căutăm formulă sau valori speciale
    let formulaCount = 0;
    let specialValues = [];
    
    for (let row = 1; row < Math.min(20, pricesSheet.rowCount); row++) {
      const cell = pricesSheet.getCell(row, 6);
      if (cell.formula) {
        formulaCount++;
        console.log(`   Rând ${row + 1}: Formulă detectată: ${cell.formula}`);
      }
      if (cell.value && typeof cell.value === 'string' && cell.value.includes('=')) {
        specialValues.push({ row: row + 1, value: cell.value });
      }
    }
    
    if (formulaCount === 0 && specialValues.length === 0) {
      console.log('   Nu sunt formule sau valori speciale detectate');
    }
    
    // Verificăm structura completă a header-elor pentru context
    console.log('\n📋 HEADERE COMPLETE Vehicle_Service_Prices:');
    console.log('==========================================');
    
    for (let col = 0; col < Math.min(15, pricesSheet.columnCount); col++) {
      const headerCell = pricesSheet.getCell(0, col);
      if (headerCell.value) {
        console.log(`Coloana ${col}: "${headerCell.value}"`);
      } else {
        console.log(`Coloana ${col}: GOALĂ`);
      }
    }
    
    // Recomandare finală
    console.log('\n💡 RECOMANDARE:');
    console.log('===============');
    if (emptyCount > 45 && withDataCount === 0) {
      console.log('✅ Coloana 6 pare să fie complet goală și neutilizată.');
      console.log('   Recomandare: Poate fi ștearsă complet dacă nu este referențiată în cod.');
    } else if (withDataCount > 0) {
      console.log('⚠️  Coloana conține date și nu poate fi ștearsă.');
      console.log('   Verificați dacă datele sunt încă relevante sau pot fi migrate.');
    } else {
      console.log('🤔 Coloana pare să fie rezervată pentru utilizare viitoare.');
      console.log('   Verificați documentația sau codul pentru a înțelege scopul.');
    }
    
    console.log('\n🎉 === ANALIZĂ FINALIZATĂ ===');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error(error.stack);
  }
}

analyzeColumn6();