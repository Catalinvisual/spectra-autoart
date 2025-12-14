import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';

async function testRowAccess() {
  try {
    console.log('🔍 Testing row access methods...');
    
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
    
    console.log('📋 Headers:', bookingsSheet.headerValues);
    
    const rows = await bookingsSheet.getRows();
    console.log(`📊 Found ${rows.length} rows`);
    
    if (rows.length > 0) {
      const firstRow = rows[0];
      console.log('\n🔍 First row details:');
      console.log('Row object keys:', Object.keys(firstRow));
      console.log('_rawData:', firstRow._rawData);
      console.log('_rowNumber:', firstRow._rowNumber);
      
      // Test different access methods
      console.log('\n🧪 Testing access methods:');
      
      // Method 1: Direct property access (what we're currently trying)
      console.log('Method 1 - Direct property access:');
      console.log('  firstRow.ID:', firstRow.ID);
      console.log('  firstRow.Name:', firstRow.Name);
      console.log('  firstRow.Date:', firstRow.Date);
      
      // Method 2: Using get() method
      if (typeof firstRow.get === 'function') {
        console.log('Method 2 - Using get() method:');
        console.log('  firstRow.get("ID"):', firstRow.get('ID'));
        console.log('  firstRow.get("Name"):', firstRow.get('Name'));
        console.log('  firstRow.get("Date"):', firstRow.get('Date'));
      }
      
      // Method 3: Using header index with _rawData
      console.log('Method 3 - Using header index with _rawData:');
      const headers = bookingsSheet.headerValues;
      const idIndex = headers.indexOf('ID');
      const nameIndex = headers.indexOf('Name');
      const dateIndex = headers.indexOf('Date');
      
      console.log('  ID index:', idIndex, 'value:', firstRow._rawData[idIndex]);
      console.log('  Name index:', nameIndex, 'value:', firstRow._rawData[nameIndex]);
      console.log('  Date index:', dateIndex, 'value:', firstRow._rawData[dateIndex]);
      
      // Test updating a row
      console.log('\n🔄 Testing row update:');
      console.log('Original date:', firstRow._rawData[dateIndex]);
      
      // Try different update methods
      const testData = { Date: '2024-12-29' };
      
      // Method 1: Object.assign (current method)
      console.log('Method 1 - Object.assign:');
      Object.assign(firstRow, testData);
      console.log('  After Object.assign - firstRow.Date:', firstRow.Date);
      console.log('  After Object.assign - _rawData[dateIndex]:', firstRow._rawData[dateIndex]);
      
      // Method 2: Using set() method
      if (typeof firstRow.set === 'function') {
        console.log('Method 2 - Using set() method:');
        firstRow.set('Date', '2024-12-30');
        console.log('  After set() - firstRow.get("Date"):', firstRow.get('Date'));
        console.log('  After set() - _rawData[dateIndex]:', firstRow._rawData[dateIndex]);
      }
      
      // Method 3: Direct _rawData manipulation
      console.log('Method 3 - Direct _rawData manipulation:');
      firstRow._rawData[dateIndex] = '2024-12-31';
      console.log('  After _rawData manipulation - _rawData[dateIndex]:', firstRow._rawData[dateIndex]);
      
      // Don't actually save the changes for this test
      console.log('\n⚠️  Changes not saved - this was just a test');
    }
    
  } catch (error) {
    console.error('❌ Error testing row access:', error.message);
  }
}

testRowAccess();