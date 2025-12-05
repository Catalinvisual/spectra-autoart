import cachedTranslationService from './src/services/cachedTranslationService.js';
import GoogleSheetsService from './src/services/googleSheetsService.js';
import dotenv from 'dotenv';

dotenv.config();

async function debugCachedTranslations() {
  try {
    console.log('🔍 Debugging cached translation service...');
    
    // Initialize Google Sheets service
    await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets service initialized');
    
    // Test Dutch language specifically
    const language = 'nl';
    console.log(`\n📋 Testing language: ${language}`);
    
    // Get raw data first
    const data = await GoogleSheetsService.getData('Vehicle_Services');
    const headers = data[0];
    console.log('Headers:', headers);
    
    const langCode = language.toUpperCase();
    console.log(`Looking for columns with suffix: _${langCode}`);
    
    // Find column indices for the requested language
    const nameCol = headers.indexOf(`Name_${langCode}`);
    const descCol = headers.indexOf(`Description_${langCode}`);
    const categoryCol = headers.indexOf(`Category_${langCode}`);
    
    console.log(`Name_${langCode} column index:`, nameCol);
    console.log(`Description_${langCode} column index:`, descCol);
    console.log(`Category_${langCode} column index:`, categoryCol);
    
    // Use fallback columns if language-specific ones don't exist
    const nameIndex = nameCol !== -1 ? nameCol : headers.indexOf('Name');
    const descIndex = descCol !== -1 ? descCol : headers.indexOf('Description');
    const categoryIndex = categoryCol !== -1 ? categoryCol : headers.indexOf('Category');
    
    console.log('Final indices:');
    console.log('nameIndex:', nameIndex);
    console.log('descIndex:', descIndex);
    console.log('categoryIndex:', categoryIndex);
    
    // Test with first row
    const firstRow = data[1];
    console.log('\nFirst row data:');
    console.log('nameIndex value:', firstRow[nameIndex]);
    console.log('descIndex value:', firstRow[descIndex]?.substring(0, 50) + '...');
    console.log('categoryIndex value:', firstRow[categoryIndex]);
    
    // Now test the actual service
    const services = await cachedTranslationService.getServicesWithTranslations(language);
    console.log(`\n✅ Found ${services.length} services for ${language}`);
    
    if (services.length > 0) {
      console.log('First service from cached service:');
      console.log('name:', services[0].name);
      console.log('description:', services[0].description?.substring(0, 50) + '...');
      console.log('category:', services[0].category);
    }
    
  } catch (error) {
    console.error('❌ Error debugging cached translations:', error);
  }
}

debugCachedTranslations();