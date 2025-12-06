import dotenv from 'dotenv';
import GoogleSheetsService from './src/services/googleSheetsService.js';

// Încarcă variabilele de mediu
dotenv.config({ path: './.env' });

async function testServiceCreation() {
  try {
    console.log('🔍 Testare creare serviciu...');
    
    // Inițializare
    await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets inițializat');
    
    // Obținem structura reală din Google Sheets
    const servicesData = await GoogleSheetsService.getData('Vehicle_Services');
    const headerRow = servicesData[0];
    console.log('📊 Structură Vehicle_Services:', headerRow);
    console.log('📊 Număr coloane:', headerRow.length);
    
    // Creăm un serviciu de test cu structura completă
    const testService = [
      'test_service_debug',                    // ID
      'Test Service Debug',                  // Name
      'Test Service Debug',                  // Name_EN
      'Test Service Debug',                  // Name_NL
      'Test Service Debug',                  // Name_ES
      'Test Service Debug',                  // Name_PL
      'Test Service Debug',                  // Name_RO
      'Test description',                    // Description
      'Test description',                    // Description_EN
      'Test description',                    // Description_NL
      'Test description',                    // Description_ES
      'Test description',                    // Description_PL
      'Test description',                    // Description_RO
      'Debug',                               // Category
      'Debug',                               // Category_EN
      'Debug',                               // Category_NL
      'Debug',                               // Category_ES
      'Debug',                               // Category_PL
      'Debug',                               // Category_RO
      '60',                                    // Duration_Minutes
      'true',                                // Is_Active
      new Date().toISOString(),              // Created_At
      '', '', '', ''                          // Coloane goale suplimentare
    ];
    
    console.log('📤 Se adaugă serviciu de test...');
    console.log('Structură serviciu (', testService.length, 'coloane):', testService);
    
    await GoogleSheetsService.appendData('Vehicle_Services', testService);
    console.log('✅ Serviciu de test adăugat cu succes!');
    
    // Testăm și prețul
    const testPrice = [
      'test_price_debug',                    // ID
      'test_service_debug',                  // Service_ID
      'sedan',                               // Body_Type_Key
      '150',                                 // Price_Min
      'EUR',                                 // Currency
      '60',                                  // Duration_Minutes
      '0',                                   // Promo_Percent
      'true',                                // Is_Active
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' // Coloane goale
    ];
    
    console.log('📤 Se adaugă preț de test...');
    console.log('Structură preț (', testPrice.length, 'coloane):', testPrice);
    
    await GoogleSheetsService.appendData('Vehicle_Service_Prices', testPrice);
    console.log('✅ Preț de test adăugat cu succes!');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error('Stack:', error.stack);
  }
}

testServiceCreation();