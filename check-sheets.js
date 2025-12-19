// Verifică inițializare Google Sheets
import GoogleSheetsService from './server/src/services/googleSheetsService.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Încarcă variabilele de mediu
dotenv.config({ path: join(__dirname, 'server', '.env') });

console.log('🔍 Verificare inițializare Google Sheets...');
console.log('📧 GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
console.log('🔑 GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);
console.log('📊 GOOGLE_SHEETS_SPREADSHEET_ID:', process.env.GOOGLE_SHEETS_SPREADSHEET_ID);

async function checkGoogleSheets() {
  try {
    const initialized = await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets inițializat:', initialized);
    
    if (initialized) {
      console.log('🧪 Test GET Vehicle_Services...');
      const data = await GoogleSheetsService.getData('Vehicle_Services');
      console.log('📊 Total rânduri:', data.length);
      console.log('📋 Header:', data[0]);
      
      if (data.length > 1) {
        console.log('✅ Servicii găsite:', data.length - 1);
        console.log('🎯 Primul serviciu ID:', data[1][0]);
      } else {
        console.log('⚠️ Nu există servicii în Google Sheets!');
      }
    } else {
      console.log('❌ Google Sheets nu este inițializat!');
      console.log('💡 Verifică credențialele Google în Railway Dashboard');
    }
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
  }
}

checkGoogleSheets();