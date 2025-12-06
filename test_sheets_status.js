import GoogleSheetsService from './server/src/services/googleSheetsService.js';

async function checkSheetsStatus() {
  try {
    console.log('🔍 Checking Google Sheets service status...');
    console.log('📊 Initializing Google Sheets service...');
    
    await GoogleSheetsService.initialize();
    
    console.log('✅ Google Sheets service initialized');
    console.log('📊 Demo mode:', GoogleSheetsService.isDemoMode);
    console.log('📊 Initialized:', GoogleSheetsService.isInitialized);
    
    if (GoogleSheetsService.isInitialized && !GoogleSheetsService.isDemoMode) {
      console.log('✅ Google Sheets service is ready for operations');
      
      // Try to get info about the spreadsheet
      const doc = GoogleSheetsService.doc;
      console.log('📊 Spreadsheet title:', doc.title);
      console.log('📊 Available sheets:', Object.keys(doc.sheetsByTitle));
      
      // Check if Vehicle_Service_Prices sheet exists
      const pricesSheet = doc.sheetsByTitle['Vehicle_Service_Prices'];
      if (pricesSheet) {
        console.log('✅ Vehicle_Service_Prices sheet found');
        console.log('📊 Sheet row count:', pricesSheet.rowCount);
        
        // Get a few rows to see the structure
        const rows = await pricesSheet.getRows({ limit: 5 });
        console.log('📊 Sample rows:', rows.map(row => ({
          ID: row.get('ID'),
          Service_ID: row.get('Service_ID'),
          Body_Type_Key: row.get('Body_Type_Key'),
          Price_Min: row.get('Price_Min')
        })));
      } else {
        console.log('❌ Vehicle_Service_Prices sheet not found');
      }
    } else {
      console.log('⚠️  Google Sheets service is not ready');
      if (GoogleSheetsService.isDemoMode) {
        console.log('📊 Service is in demo mode - no actual Google Sheets operations');
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking Google Sheets status:', error.message);
  }
}

checkSheetsStatus();