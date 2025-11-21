import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: join(__dirname, '.env') });

console.log('🔍 Testing environment variables...');
console.log('📊 SPREADSHEET_ID:', process.env.GOOGLE_SHEETS_SPREADSHEET_ID ? '✅ Found' : '❌ Missing');
console.log('📧 SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Found' : '❌ Missing');
console.log('🔑 PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✅ Found' : '❌ Missing');
console.log('🔑 PRIVATE_KEY length:', process.env.GOOGLE_PRIVATE_KEY?.length || 0);

// Now test Google Sheets connection
import GoogleSheetsService from './src/services/googleSheetsService.js';

async function testGoogleSheets() {
  try {
    console.log('\n🚀 Testing Google Sheets connection...');
    await GoogleSheetsService.initialize();
    
    console.log('📊 Getting Vehicles data...');
    const data = await GoogleSheetsService.getData('Vehicles');
    console.log(`✅ Found ${data.length} rows in Vehicles sheet`);
    console.log('First few rows:', data.slice(0, 3));
    
  } catch (error) {
    console.error('❌ Error testing Google Sheets:', error.message);
  }
}

testGoogleSheets();