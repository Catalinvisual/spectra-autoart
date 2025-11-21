import GoogleSheetsService from './src/services/googleSheetsService.js';
import { translateMultipleWithCache } from './src/services/translationCacheService.js';
import { fallbackModels } from './src/data/vehicleData.js';

async function populateVehiclesSimple() {
  try {
    console.log('🚀 Starting vehicle data population...');
    
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
    
    // Process first 10 vehicles as test
    const testVehicles = vehicles.slice(0, 10);
    console.log(`🧪 Processing first ${testVehicles.length} vehicles as test...`);
    
    const rowsToInsert = [headerRow];
    
    for (let i = 0; i < testVehicles.length; i++) {
      const vehicle = testVehicles[i];
      console.log(`🔄 Processing vehicle ${i + 1}/${testVehicles.length}: ${vehicle.make} ${vehicle.model}`);
      
      try {
        // Translate to all languages
        const [
          makeEn, makeEs, makePl, makeRo,
          modelEn, modelEs, modelPl, modelRo,
          typeEn, typeEs, typePl, typeRo,
          bodyEn, bodyEs, bodyPl, bodyRo
        ] = await Promise.all([
          // Make translations
          translateMultipleWithCache([vehicle.make], 'en'),
          translateMultipleWithCache([vehicle.make], 'es'),
          translateMultipleWithCache([vehicle.make], 'pl'),
          translateMultipleWithCache([vehicle.make], 'ro'),
          
          // Model translations
          translateMultipleWithCache([vehicle.model], 'en'),
          translateMultipleWithCache([vehicle.model], 'es'),
          translateMultipleWithCache([vehicle.model], 'pl'),
          translateMultipleWithCache([vehicle.model], 'ro'),
          
          // Type translations
          translateMultipleWithCache([vehicle.type], 'en'),
          translateMultipleWithCache([vehicle.type], 'es'),
          translateMultipleWithCache([vehicle.type], 'pl'),
          translateMultipleWithCache([vehicle.type], 'ro'),
          
          // Body translations
          translateMultipleWithCache([vehicle.body], 'en'),
          translateMultipleWithCache([vehicle.body], 'es'),
          translateMultipleWithCache([vehicle.body], 'pl'),
          translateMultipleWithCache([vehicle.body], 'ro')
        ]);
        
        const row = [
          vehicle.id,
          vehicle.make, makeEn[0], makeEs[0], makePl[0], makeRo[0],
          vehicle.model, modelEn[0], modelEs[0], modelPl[0], modelRo[0],
          vehicle.type, typeEn[0], typeEs[0], typePl[0], typeRo[0],
          vehicle.body, bodyEn[0], bodyEs[0], bodyPl[0], bodyRo[0],
          vehicle.active,
          vehicle.created_date,
          vehicle.updated_date
        ];
        
        rowsToInsert.push(row);
        console.log(`✅ Added ${vehicle.make} ${vehicle.model}`);
        
      } catch (translationError) {
        console.error(`❌ Translation error for ${vehicle.make} ${vehicle.model}:`, translationError.message);
        // Add row with original data
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
      }
    }
    
    // Insert data
    console.log(`📤 Inserting ${rowsToInsert.length - 1} vehicles into Google Sheets...`);
    await GoogleSheetsService.appendData('Vehicles', rowsToInsert);
    console.log('✅ Successfully populated Vehicles sheet with test data!');
    
    // Verify data was inserted
    const newData = await GoogleSheetsService.getData('Vehicles');
    console.log(`📊 Vehicles sheet now has ${newData.length} rows`);
    console.log('First few rows:', newData.slice(0, 3));
    
  } catch (error) {
    console.error('❌ Error populating vehicles:', error.message);
    console.error(error.stack);
  }
}

populateVehiclesSimple();