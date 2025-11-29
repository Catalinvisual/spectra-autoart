import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve('./.env.local');
dotenv.config({ path: envPath });

console.log('Environment loaded:');
console.log('📊 SPREADSHEET_ID:', process.env.GOOGLE_SHEETS_SPREADSHEET_ID);
console.log('📧 SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
console.log('🔑 PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);
console.log('🔑 PRIVATE_KEY length:', process.env.GOOGLE_PRIVATE_KEY?.length);

// Import after dotenv config
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

async function testGoogleSheetsAuth() {
  try {
    console.log('\n🧪 Testing Google Sheets authentication...');
    
    // Clean private key
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || 
        (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    console.log('🔑 Cleaned private key length:', privateKey.length);
    
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    console.log('✅ Google Sheets authentication successful!');
    console.log('📋 Spreadsheet title:', doc.title);
    console.log('📊 Sheet count:', doc.sheetCount);
    
  } catch (error) {
    console.error('❌ Google Sheets authentication failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testGoogleSheetsAuth();