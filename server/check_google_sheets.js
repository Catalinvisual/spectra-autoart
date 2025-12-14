import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';

async function checkGoogleSheetsConnection() {
  console.log('🔍 Checking Google Sheets connection...');
  
  try {
    // Check if service account file exists
    const serviceAccountPath = './config/service-account.json';
    if (!fs.existsSync(serviceAccountPath)) {
      console.log('❌ Service account file not found:', serviceAccountPath);
      return;
    }
    
    console.log('✅ Service account file exists');
    
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    console.log('✅ Service account parsed successfully');
    console.log('📧 Service account email:', serviceAccount.client_email);
    
    const serviceAccountAuth = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log('🔄 Connecting to Google Sheets...');
    const doc = new GoogleSpreadsheet('1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90', serviceAccountAuth);
    
    await doc.loadInfo();
    console.log('✅ Successfully connected to Google Sheets');
    console.log('📊 Spreadsheet title:', doc.title);
    console.log('📋 Available sheets:', Object.keys(doc.sheetsByTitle));
    
    // Check Bookings sheet
    if (doc.sheetsByTitle['Bookings']) {
      const bookingsSheet = doc.sheetsByTitle['Bookings'];
      await bookingsSheet.loadHeaderRow();
      console.log('📋 Bookings headers:', bookingsSheet.headerValues);
      
      const rows = await bookingsSheet.getRows();
      console.log(`📊 Found ${rows.length} booking rows`);
      
      if (rows.length > 0) {
        console.log('🎯 First booking row data:');
        console.log('  Raw data:', rows[0]._rawData);
        console.log('  ID (get method):', rows[0].get('ID'));
        console.log('  Name (get method):', rows[0].get('Name'));
        console.log('  Date (get method):', rows[0].get('Date'));
      }
    } else {
      console.log('❌ Bookings sheet not found');
    }
    
  } catch (error) {
    console.error('❌ Google Sheets connection failed:', error.message);
    console.error('Full error:', error);
  }
}

checkGoogleSheetsConnection();