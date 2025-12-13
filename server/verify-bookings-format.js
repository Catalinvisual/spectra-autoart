// Script to check Google Sheets booking data
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkGoogleSheetsData() {
  try {
    console.log('🔍 Checking Google Sheets booking data...');
    
    // Clean private key - remove surrounding quotes if present
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    const bookingsSheet = doc.sheetsByTitle['Bookings'];
    if (!bookingsSheet) {
      console.log('❌ Bookings sheet not found');
      return;
    }
    
    console.log(`📊 Found Bookings sheet with ${bookingsSheet.rowCount} rows`);
    
    // Get the last few rows
    const rows = await bookingsSheet.getRows();
    console.log(`📋 Total rows: ${rows.length}`);
    
    if (rows.length > 0) {
      console.log('\n📝 Last 3 bookings:');
      const lastRows = rows.slice(-3);
      lastRows.forEach((row, index) => {
        console.log(`\nBooking ${index + 1}:`);
        console.log(`  Row data:`, Object.keys(row).map(key => `${key}: ${row[key]}`).join(', '));
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking Google Sheets:', error.message);
  }
}

checkGoogleSheetsData();