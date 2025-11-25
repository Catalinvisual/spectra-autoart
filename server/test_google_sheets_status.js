import GoogleSheetsService from './src/services/googleSheetsService.js';

async function testGoogleSheetsStatus() {
  console.log('🔍 Testing Google Sheets service status...\n');
  
  try {
    // Check if service is initialized
    console.log('📊 Google Sheets Service Status:');
    console.log('- isInitialized:', GoogleSheetsService.isInitialized);
    console.log('- isDemoMode:', GoogleSheetsService.isDemoMode);
    console.log('- doc exists:', !!GoogleSheetsService.doc);
    
    if (GoogleSheetsService.isInitialized && !GoogleSheetsService.isDemoMode) {
      console.log('✅ Service is initialized and not in demo mode');
      
      // Try to get spreadsheet info
      try {
        const info = await GoogleSheetsService.doc.loadInfo();
        console.log('📊 Spreadsheet title:', GoogleSheetsService.doc.title);
        console.log('📊 Spreadsheet ID:', GoogleSheetsService.doc.spreadsheetId);
        console.log('📊 Available sheets:', Object.keys(GoogleSheetsService.doc.sheetsByTitle));
      } catch (error) {
        console.error('❌ Error loading spreadsheet info:', error.message);
      }
    } else if (GoogleSheetsService.isDemoMode) {
      console.log('⚠️  Service is in demo mode - using local data');
    } else {
      console.log('❌ Service is not initialized');
      
      // Try to initialize manually
      console.log('🔄 Attempting manual initialization...');
      const initialized = await GoogleSheetsService.initialize();
      console.log('✅ Manual initialization result:', initialized);
    }
    
  } catch (error) {
    console.error('❌ Error testing Google Sheets service:', error.message);
    console.error('Stack:', error.stack);
  }
}

testGoogleSheetsStatus();