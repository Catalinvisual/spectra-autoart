import GoogleSheetsService from './server/src/services/googleSheetsService.js';

async function debugGoogleSheets() {
  try {
    console.log('🔍 Debug Google Sheets...');
    
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
    
    // Testăm adăugare rând simplu
    console.log('\n➕ Testare adăugare rând simplu...');
    const testRow = [
      'test_service_999',
      'Test Service Debug',
      'Test Service Debug',
      'Test Service Debug',
      'Test Service Debug',
      'Test Service Debug',
      'Test Service Debug',
      'Test description',
      'Test description',
      'Test description',
      'Test description',
      'Test description',
      'Test description',
      'Debug',
      'Debug',
      'Debug',
      'Debug',
      'Debug',
      'Debug',
      '60',
      'true',
      new Date().toISOString()
    ];
    
    console.log('Se adaugă rândul de test...');
    await GoogleSheetsService.appendData('Vehicle_Services', testRow);
    console.log('✅ Rând de test adăugat cu succes!');
    
    // Test preț
    console.log('\n➕ Testare adăugare preț...');
    const testPriceRow = [
      'test_price_999',
      'test_service_999',
      'sedan',
      '150',
      'EUR',
      '60',
      '0',
      'true'
    ];
    
    console.log('Se adaugă prețul de test...');
    await GoogleSheetsService.appendData('Vehicle_Service_Prices', testPriceRow);
    console.log('✅ Preț de test adăugat cu succes!');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugGoogleSheets();