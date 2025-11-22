// Script to check booking headers and structure
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkBookingStructure() {
  try {
    console.log('🔍 Checking booking structure...');
    
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
    
    // Get headers from first row
    const rows = await bookingsSheet.getRows();
    if (rows.length > 0) {
      console.log('📋 Headers (first row):', rows[0]._rawData);
      console.log('📊 Total columns:', rows[0]._rawData.length);
      
      // Show a few example rows to understand the structure
      console.log('\n📝 Example booking rows:');
      for (let i = Math.max(0, rows.length - 3); i < rows.length; i++) {
        console.log(`Row ${i + 1}:`, rows[i]._rawData);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking booking structure:', error.message);
  }
}

checkBookingStructure();