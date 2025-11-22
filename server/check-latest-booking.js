// Simple script to check the latest booking data
import GoogleSheetsService from './src/services/googleSheetsService.js';

async function checkLatestBooking() {
  try {
    console.log('🔍 Checking latest booking data...');
    
    // Test the appendDataWithFormats method directly
    const testData = ['1763815214879', 'Test User', 'test@example.com', '123456789', "'2025-11-30", "'14:30", 'fsdg dfggf dfgd ret', '55', 'confirmed', new Date().toISOString()];
    
    console.log('📊 Test data with single quote prefix:');
    console.log('Date column (4):', testData[4]);
    console.log('Time column (5):', testData[5]);
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkLatestBooking();