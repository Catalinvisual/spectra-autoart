import dotenv from 'dotenv';
import GoogleSheetsService from './src/services/googleSheetsService.js';

// Încarcă variabilele de mediu
dotenv.config({ path: './.env' });

async function debugGoogleSheets() {
  try {
    console.log('🔍 Debug Google Sheets...');
    console.log('📊 SPREADSHEET_ID:', process.env.GOOGLE_SHEETS_SPREADSHEET_ID);
    
    // Inițializare
    await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets inițializat');
    
    // Verificăm structura Vehicle_Services
    console.log('\n📋 Verificare Vehicle_Services...');
    const servicesData = await GoogleSheetsService.getData('Vehicle_Services');
    console.log('Vehicle_Services - Rânduri:', servicesData.length);
    if (servicesData.length > 0) {
      console.log('Antet:', servicesData[0]);
      console.log('Ultimul rând:', servicesData[servicesData.length - 1]);
    }
    
    // Verificăm structura Vehicle_Service_Prices
    console.log('\n📋 Verificare Vehicle_Service_Prices...');
    const pricesData = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    console.log('Vehicle_Service_Prices - Rânduri:', pricesData.length);
    if (pricesData.length > 0) {
      console.log('Antet:', pricesData[0]);
      console.log('Ultimul rând:', pricesData[pricesData.length - 1]);
    }
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugGoogleSheets();