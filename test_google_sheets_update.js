import { GoogleSheetsService } from './server/src/services/googleSheetsService.js';

async function testGoogleSheetsUpdate() {
  try {
    console.log('🧪 Testing Google Sheets update...');
    
    // Initialize Google Sheets service
    await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets service initialized');
    
    // Get current data
    const data = await GoogleSheetsService.getData('Bookings');
    console.log(`📊 Current data rows: ${data.length}`);
    
    // Find a test row (let's use row 2 for testing)
    if (data.length > 2) {
      const testRowIndex = 2; // Third row (0-based index, skipping header)
      const originalRow = [...data[testRowIndex]]; // Copy original data
      
      console.log(`📝 Original row ${testRowIndex}:`, originalRow);
      
      // Modify the date column (assuming it's column 4)
      const dateColumnIndex = 4;
      const newDate = '2025-12-30';
      data[testRowIndex][dateColumnIndex] = `'${newDate}`;
      
      console.log(`🔄 Updating date from ${originalRow[dateColumnIndex]} to '${newDate}`);
      console.log(`📅 Updated row ${testRowIndex}:`, data[testRowIndex]);
      
      // Update the row in Google Sheets
      console.log(`🚀 Calling updateData with rowIndex: ${testRowIndex}`);
      await GoogleSheetsService.updateData('Bookings', testRowIndex, data[testRowIndex]);
      console.log('✅ updateData completed');
      
      // Re-fetch data to verify update
      console.log('🔄 Re-fetching data to verify update...');
      const updatedData = await GoogleSheetsService.getData('Bookings');
      const updatedRow = updatedData[testRowIndex];
      
      console.log(`📅 Updated row ${testRowIndex}:`, updatedRow);
      
      if (updatedRow[dateColumnIndex] === `'${newDate}`) {
        console.log('✅ SUCCESS: Google Sheets update worked!');
      } else {
        console.log('❌ FAILED: Google Sheets update did not work');
        console.log(`Expected: '${newDate}`);
        console.log(`Actual: ${updatedRow[dateColumnIndex]}`);
      }
      
      // Restore original data
      console.log('🔄 Restoring original data...');
      await GoogleSheetsService.updateData('Bookings', testRowIndex, originalRow);
      console.log('✅ Original data restored');
      
    } else {
      console.log('❌ Not enough data rows for testing');
    }
    
  } catch (error) {
    console.error('❌ Error testing Google Sheets update:', error);
    console.error('Error stack:', error.stack);
  }
}

// Run the test
testGoogleSheetsUpdate();