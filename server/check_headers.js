import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';

async function checkGoogleSheetsHeaders() {
  try {
    console.log('🔍 Checking Google Sheets headers...');
    
    const serviceAccount = JSON.parse(fs.readFileSync('./config/service-account.json', 'utf8'));
    
    const serviceAccountAuth = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const doc = new GoogleSpreadsheet('1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90', serviceAccountAuth);
    await doc.loadInfo();
    
    const bookingsSheet = doc.sheetsByTitle['Bookings'];
    await bookingsSheet.loadHeaderRow();
    
    console.log('📋 Headers in Bookings sheet:');
    console.log('📊 Header values:', bookingsSheet.headerValues);
    console.log('📊 Header count:', bookingsSheet.headerValues.length);
    
    const rows = await bookingsSheet.getRows();
    console.log('\n📋 First row properties:');
    if (rows.length > 0) {
      const firstRow = rows[0];
      console.log('Available properties:', Object.keys(firstRow));
      console.log('ID value:', firstRow.ID);
      console.log('Name value:', firstRow.Name);
      console.log('Date value:', firstRow.Date);
    }
    
  } catch (error) {
    console.error('❌ Error accessing Google Sheets:', error.message);
    console.error('Full error:', error);
  }
}

checkGoogleSheetsHeaders();