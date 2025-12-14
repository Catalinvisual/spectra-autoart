import GoogleSheetsService from './server/src/services/googleSheetsService.js';

async function debugProductionStatus() {
  console.log('🔍 Debugging production GoogleSheetsService status...');
  
  // Try to initialize the service
  console.log('🔄 Attempting to initialize GoogleSheetsService...');
  const initialized = await GoogleSheetsService.initialize();
  
  console.log('📊 After initialization:');
  console.log('📊 isInitialized:', GoogleSheetsService.isInitialized);
  console.log('📊 isDemoMode:', GoogleSheetsService.isDemoMode);
  console.log('📊 Initialization result:', initialized);
  
  // Check environment variables
  console.log('🌍 Environment check:');
  console.log('📊 NODE_ENV:', process.env.NODE_ENV);
  console.log('📊 RAILWAY_PROJECT_ID:', process.env.RAILWAY_PROJECT_ID);
  console.log('📊 GOOGLE_SHEETS_SPREADSHEET_ID:', process.env.GOOGLE_SHEETS_SPREADSHEET_ID);
  console.log('📊 GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  console.log('📊 GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);
  
  // Test the actual response structure
  console.log('\n🧪 Testing 503 response structure:');
  const mockResponse = {
    error: 'Google Sheets service not initialized',
    message: 'The dashboard is temporarily unavailable. Please try again later.',
    demoMode: GoogleSheetsService.isDemoMode
  };
  console.log('📤 Mock response:', JSON.stringify(mockResponse, null, 2));
}

debugProductionStatus().catch(console.error);