import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';

async function testDateUpdate() {
  try {
    console.log('🔄 Testing date update functionality...');
    
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
    
    const rows = await bookingsSheet.getRows();
    console.log(`📊 Found ${rows.length} rows`);
    
    if (rows.length > 0) {
      const firstRow = rows[0];
      const originalDate = firstRow.get('Date');
      console.log('📅 Original date:', originalDate);
      
      // Test the new update method
      const newDate = '2024-12-29';
      console.log('🔄 Updating date to:', newDate);
      
      // Use the set() method (our new approach)
      firstRow.set('Date', newDate);
      
      // Verify the change
      console.log('✅ After set() - Date:', firstRow.get('Date'));
      console.log('✅ After set() - _rawData date index:', firstRow._rawData[4]); // Date is at index 4
      
      // Actually save the change
      await firstRow.save();
      console.log('💾 Changes saved successfully!');
      
      // Verify the change persisted
      console.log('🔍 Verifying saved changes...');
      const freshRows = await bookingsSheet.getRows();
      const updatedRow = freshRows[0];
      console.log('✅ Fresh data - Date:', updatedRow.get('Date'));
      
      // Restore original date
      console.log('🔄 Restoring original date...');
      updatedRow.set('Date', originalDate);
      await updatedRow.save();
      console.log('✅ Original date restored!');
      
    } else {
      console.log('❌ No rows found to test');
    }
    
  } catch (error) {
    console.error('❌ Error testing date update:', error.message);
  }
}

testDateUpdate();