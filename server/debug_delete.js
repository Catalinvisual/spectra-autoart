import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

import GoogleSheetsService from './src/services/googleSheetsService.js';

async function debugDelete() {
  try {
    const service = GoogleSheetsService;
    await service.initialize();
    const data = await service.getData('Gallery');
    
    console.log('Full gallery data:');
    console.log(JSON.stringify(data, null, 2));
    
    const targetId = '1764176087653';
    console.log(`\nLooking for ID: ${targetId}`);
    
    // Get headers
    const headers = data[0];
    console.log('Headers:', headers);
    
    // Find ID column
    const idColumnIndex = headers.findIndex(header => 
      header.toLowerCase().replace(/ /g, '_') === 'id'
    );
    console.log('ID column index:', idColumnIndex);
    
    if (idColumnIndex === -1) {
      console.log('ID column not found!');
      return;
    }
    
    // Check each row
    data.slice(1).forEach((row, index) => {
      const rowId = row[idColumnIndex];
      console.log(`Row ${index + 1}: ID = ${rowId} (type: ${typeof rowId})`);
      console.log(`Comparison: ${String(rowId)} === ${String(targetId)} = ${String(rowId) === String(targetId)}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugDelete();