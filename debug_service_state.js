import GoogleSheetsService from './server/src/services/googleSheetsService.js';

async function debugServiceState() {
  console.log('🔍 Checking Google Sheets Service state...');
  console.log('isInitialized:', GoogleSheetsService.isInitialized);
  console.log('isDemoMode:', GoogleSheetsService.isDemoMode);
  
  // Try to initialize
  console.log('\n🚀 Attempting to initialize...');
  const result = await GoogleSheetsService.initialize();
  console.log('Initialize result:', result);
  console.log('After initialization:');
  console.log('isInitialized:', GoogleSheetsService.isInitialized);
  console.log('isDemoMode:', GoogleSheetsService.isDemoMode);
  
  // Check environment
  console.log('\n🌍 Environment variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('RAILWAY_PROJECT_ID:', process.env.RAILWAY_PROJECT_ID);
  console.log('RAILWAY_SERVICE_ID:', process.env.RAILWAY_SERVICE_ID);
  console.log('PORT:', process.env.PORT);
  console.log('CLIENT_ORIGIN:', process.env.CLIENT_ORIGIN);
  
  // Test production detection
  const isProduction = process.env.RAILWAY_PROJECT_ID || 
                       process.env.NODE_ENV === 'production' || 
                       process.env.RAILWAY_SERVICE_ID ||
                       process.env.PORT === '8080' ||
                       !process.env.CLIENT_ORIGIN?.includes('localhost');
  
  console.log('\n🏭 Production detection:', isProduction);
}

debugServiceState().catch(console.error);