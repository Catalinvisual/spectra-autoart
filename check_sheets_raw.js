import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';

async function checkGoogleSheetsRawData() {
  try {
    console.log('🔍 Checking raw Google Sheets data...');
    
    const serviceAccount = JSON.parse(fs.readFileSync('./server/config/service-account.json', 'utf8'));
    
    const serviceAccountAuth = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const doc = new GoogleSpreadsheet('1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90', serviceAccountAuth);
    await doc.loadInfo();
    
    const bookingsSheet = doc.sheetsByTitle['Bookings'];
    const rows = await bookingsSheet.getRows();
    
    console.log('📋 Raw data from Google Sheets Bookings:');
    console.log('📊 Total rows:', rows.length);
    
    rows.forEach((row, index) => {
      console.log(`\nRow ${index + 1}:`);
      console.log(`  Raw row data:`, row._rawData);
      console.log(`  ID: "${row.ID || 'undefined'}"`);
      console.log(`  Name: "${row.Name || 'undefined'}"`);
      console.log(`  Email: "${row.Email || 'undefined'}"`);
      console.log(`  Phone: "${row.Phone || 'undefined'}"`);
      console.log(`  Date: "${row.Date || 'undefined'}"`);
      console.log(`  Time: "${row.Time || 'undefined'}"`);
      console.log(`  Services: "${row.Services || 'undefined'}"`);
    });
    
  } catch (error) {
    console.error('❌ Error accessing Google Sheets:', error.message);
    console.error('Full error:', error);
  }
}

checkGoogleSheetsRawData();