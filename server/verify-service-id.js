import dotenv from 'dotenv';
import GoogleSheetsService from './src/services/googleSheetsService.js';

// Încarcă variabilele de mediu
dotenv.config();

async function verifyServiceIdInSheets() {
  try {
    console.log('🔍 Verifying Service_ID in Google Sheets...');
    
    // Initializează serviciul Google Sheets
    await GoogleSheetsService.initialize();
    
    // Obține foaia Vehicle_Service_Prices
    const doc = GoogleSheetsService.doc;
    const sheet = doc.sheetsByTitle['Vehicle_Service_Prices'];
    
    if (!sheet) {
      throw new Error('Vehicle_Service_Prices sheet not found');
    }
    
    // Obține toate rândurile
    const rows = await sheet.getRows();
    
    console.log(`📊 Found ${rows.length} price entries in Vehicle_Service_Prices`);
    
    // Verifică ultimele 7 rânduri (cele adăugate recent)
    const recentRows = rows.slice(-7);
    
    console.log('🔍 Checking recent price entries:');
    recentRows.forEach((row, index) => {
      const rowIndex = rows.length - 7 + index + 1;
      console.log(`Row ${rowIndex}: ID=${row.get('ID')}, Service_ID=${row.get('Service_ID')}, Body_Type_ID=${row.get('Body_Type_ID')}, Price_Min=${row.get('Price_Min')}-${row.get('Price_Max')} EUR`);
    });
    
    // Verifică dacă toate rândurile recente au Service_ID
    const allHaveServiceId = recentRows.every(row => {
      const serviceId = row.get('Service_ID');
      return serviceId && serviceId !== '' && serviceId !== 'undefined';
    });
    
    console.log('\n✅ Verification Result:');
    console.log(`- Total price entries: ${rows.length}`);
    console.log(`- Recent entries with Service_ID: ${allHaveServiceId ? '✅ ALL OK' : '❌ SOME MISSING'}`);
    
    if (allHaveServiceId) {
      console.log('🎉 SUCCESS: All recent price entries have Service_ID saved correctly!');
    } else {
      console.log('⚠️  WARNING: Some recent price entries are missing Service_ID');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

verifyServiceIdInSheets();