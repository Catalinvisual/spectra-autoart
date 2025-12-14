import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';

async function testSpreadsheetAccess() {
  try {
    console.log('Testing spreadsheet access...');
    const serviceAccount = JSON.parse(fs.readFileSync('./config/service-account.json', 'utf8'));
    
    const serviceAccountAuth = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const doc = new GoogleSpreadsheet('1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90', serviceAccountAuth);
    await doc.loadInfo();
    console.log('✅ Spreadsheet loaded successfully!');
    console.log('📊 Title:', doc.title);
    console.log('📋 Sheet count:', doc.sheetCount);
    
    // List all sheets
    for (let i = 0; i < doc.sheetCount; i++) {
      const sheet = doc.sheetsByIndex[i];
      console.log(`  - ${sheet.title} (ID: ${sheet.sheetId})`);
    }
    
  } catch (error) {
    console.error('❌ Error accessing spreadsheet:', error.message);
    console.error('Full error:', error);
  }
}

testSpreadsheetAccess();