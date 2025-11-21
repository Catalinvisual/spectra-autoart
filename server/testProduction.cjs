const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function testProductionData() {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    const vehiclesSheet = doc.sheetsByTitle['Vehicles'];
    await vehiclesSheet.loadCells('A1:X10');
    
    console.log('✅ Google Sheets connection successful');
    console.log('📊 Vehicles sheet rows:', vehiclesSheet.rowCount);
    
    // Check first few rows
    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        const cell = vehiclesSheet.getCell(i, j);
        row.push(cell.value || '');
      }
      console.log(`Row ${i + 1}:`, row.join(' | '));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testProductionData();