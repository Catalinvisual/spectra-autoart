import GoogleSheetsService from './src/services/googleSheetsService.js';
import { fallbackModels } from './src/data/vehicleData.js';

async function populateVehiclesForceReal() {
  try {
    console.log('🚀 Starting FORCE REAL vehicle data population...');
    
    // Force real mode by setting environment variables
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = '1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90';
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'spectra-autoart@spectra-autoart.iam.gserviceaccount.com';
    process.env.GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqHRdowGztApz3\n3TbsjDZTPuXBi6YM4a9KH2EfMlmp2Ny58fGnmOIqEi9PzLbRYH5K/k+y09bzJzyz\nbK3CR/qjhU7oNfxqCmzlanJC/n5+UwNrdbVPxnBaXgbJT6N5gOPiKB0auYzgE9AG\n8zh7PqvGpu3oynfvnpz5I/x55CnhsAOkRsN8JGnO6XxAC9Vb2AK7dx7uiWvSU8Gc\nbzIs+j4M1DOLQ9Kh273gmUUC26oQolxcq4nuPQXTsukH81V/HDKHZGPkQ/Qm+OZh\nzVK9nua161mrAusq4CZMdtWhoZ3rQyPIfWaNW7MC+eTRFW65M6A/0qAYCh8uX0s1\n7nU29bIxAgMBAAECggEAJAaLKZTuvHa8NUW01v2Ol6yPTaC8Zqf4zlK857VrBaw2\nem6BhcO7ybsWJ+krokW0GT+oMy/nqpDZqwnN9oH102Fs54JfVTml/CPB1Ow+b5Q2\n+i/wWNemfYzCFSn3bcjc+c0S9NDsw5uOh5pEkN0h1a0OXylZovZNOfnkAxBNykx6\ng1Lhaim3qG7YmxNy/Z3xdwTBAuixvMOmAYmeXeIM3XJKCVuHsIir91fcIU59iqJL\nl209OIe6FVhDj7OIAuouxlqX/eZwu4fizz5ch0k7QQNuiWq7e2/JfTylDaJ/cKRa\n3bnD4WtAxbondEww1GF/FPzBmcs5XqF09VRhYv1TkQKBgQDlCfUf6DnX18Rp7+LM\nKQClpPpGAVHN4wIbRD1QHvtVighTuKuk38cUsLEBZt/3BYsRLWHoFHLux0c61LDw\nNPcBoY/i6ciwu3l5Jh4OO4KUFf6kBwQl8IhxUJocNPeSMgIX+Q9QxceQ6mAvrH8S\n6wmpYA7PGJPLlZxAEuT3dg/8vQKBgQC+I27JgAxm3/Mx92a70e6HebftNDyHpQiE\n4bEZ0tDpJbgqfruAE9wZUJhjUDxtGNqkVc3fNBkGHVQSitqEmeq5xOrMMEcpoleY\n7WHD7wiYTk+L/omSaI+nBTrYL5BU93kqUSlUMc08XMGswq/nHGI7XtFmTRUi2VKz\np9E9IiU0hQKBgDG5W7I1pHkrqsSlA8P3EuDjVEJmfvAH3Kk2w2jlkQMdGHm0me8N\ndhcT1RnMz8q9NVfhVmQgLGOSd/BZxKAhn46HGMnWn29fBBw9HkFQwiSMMeBCdbAW\n7EhNi2ecSDNBEBtMQvryNUVM3Nz8wgnFZS+UXyKu30dPj8CJWZQv2YCxAoGBAJuX\nKShwxTVF25+uwP2/G373BqBv13x0exUqDp+AGP5ApIT5sftrxPdeMWVLmjb4WKqT\noGUfH78WLt8BizFpNmAQGMdAVmtmcmItFoycRR9FLej0QKVzNOJK8E1KFsTAwgDz\n62r/WeAkU0RJCGKJooTM4XPibgJXbkqfcCSjlWh1AoGALcA1/2bnvIwht+HQEpzB\nRBjb4DGwnixVfJ92s1CXuCWcJk3gKuqMHFTQwpp59dMHF+EjRc9mQZtSckaZ/xVW\ndPF8S3Zf80RoPf9cWEMR7C0g1gDqCMft81K+xuIX/XijxOKjTF5o7d2M4RMLDGqZ\nmlsTsXu9FiWXbhS3KsX0CT4=\n-----END PRIVATE KEY-----\n";
    
    // Initialize Google Sheets service
    await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets service initialized');
    
    // Extract all makes and models
    const vehicles = [];
    let idCounter = 1;
    
    for (const [make, models] of Object.entries(fallbackModels)) {
      for (const model of models) {
        vehicles.push({
          id: idCounter++,
          make: make,
          model: model,
          type: 'Car',
          body: 'Sedan',
          active: 'TRUE',
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        });
      }
    }
    
    console.log(`📊 Found ${vehicles.length} vehicles to process`);
    
    // Create header row
    const headerRow = [
      'ID', 
      'Make_NL', 'Make_EN', 'Make_ES', 'Make_PL', 'Make_RO',
      'Model_NL', 'Model_EN', 'Model_ES', 'Model_PL', 'Model_RO',
      'Type_NL', 'Type_EN', 'Type_ES', 'Type_PL', 'Type_RO',
      'Body_NL', 'Body_EN', 'Body_ES', 'Body_PL', 'Body_RO',
      'Active', 'Created_Date', 'Updated_Date'
    ];
    
    // Check current data
    const existingData = await GoogleSheetsService.getData('Vehicles');
    console.log(`📊 Current Vehicles sheet has ${existingData.length} rows`);
    console.log('Sample data:', existingData.slice(0, 3));
    
    // Process first 5 vehicles as test
    const testVehicles = vehicles.slice(0, 5);
    console.log(`🧪 Processing first ${testVehicles.length} vehicles as test...`);
    
    const rowsToInsert = [headerRow];
    
    for (let i = 0; i < testVehicles.length; i++) {
      const vehicle = testVehicles[i];
      console.log(`🔄 Processing vehicle ${i + 1}/${testVehicles.length}: ${vehicle.make} ${vehicle.model}`);
      
      // Create row with same data for all languages (fallback)
      const row = [
        vehicle.id,
        vehicle.make, vehicle.make, vehicle.make, vehicle.make, vehicle.make,
        vehicle.model, vehicle.model, vehicle.model, vehicle.model, vehicle.model,
        vehicle.type, vehicle.type, vehicle.type, vehicle.type, vehicle.type,
        vehicle.body, vehicle.body, vehicle.body, vehicle.body, vehicle.body,
        vehicle.active,
        vehicle.created_date,
        vehicle.updated_date
      ];
      
      rowsToInsert.push(row);
      console.log(`✅ Added ${vehicle.make} ${vehicle.model}`);
    }
    
    // Insert data
    console.log(`📤 Inserting ${rowsToInsert.length - 1} vehicles into Google Sheets...`);
    
    // Clear existing data first
    console.log('🧹 Clearing existing data...');
    await GoogleSheetsService.clearSheet('Vehicles');
    console.log('✅ Sheet cleared');
    
    // Append new data
    await GoogleSheetsService.appendData('Vehicles', rowsToInsert);
    console.log('✅ Successfully populated Vehicles sheet with real data!');
    
    // Verify data was inserted
    const newData = await GoogleSheetsService.getData('Vehicles');
    console.log(`📊 Vehicles sheet now has ${newData.length} rows`);
    console.log('First few rows:', newData.slice(0, 3));
    
  } catch (error) {
    console.error('❌ Error populating vehicles:', error.message);
    console.error(error.stack);
  }
}

populateVehiclesForceReal();