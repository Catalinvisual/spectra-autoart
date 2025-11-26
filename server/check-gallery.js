import dotenv from 'dotenv';
import GoogleSheetsService from './src/services/googleSheetsService.js';

// Încarcă variabilele de mediu
dotenv.config();

async function checkGalleryData() {
  try {
    // Inițializează serviciul Google Sheets
    await GoogleSheetsService.initialize();
    
    const data = await GoogleSheetsService.getData('Gallery');
    console.log('Raw data from Google Sheets:');
    console.log(JSON.stringify(data, null, 2));
    
    // Afișează și câteva detalii despre structura datelor
    if (data && data.length > 0) {
      console.log('\n=== DETALII STRUCTURĂ ===');
      console.log('Număr total de rânduri:', data.length);
      console.log('Primul rând (header):', data[0]);
      if (data.length > 1) {
        console.log('Al doilea rând (date):', data[1]);
        console.log('Număr coloane:', data[0].length);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkGalleryData();
