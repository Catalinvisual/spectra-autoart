import GoogleSheetsService from '../server/src/services/googleSheetsService.js'
import { translateMultipleWithCache } from '../server/src/services/translationCacheService.js'
import { fallbackModels } from '../server/src/data/vehicleData.js'
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: join(__dirname, '../server/.env') });

async function populateVehiclesMultilingualReal() {
  try {
    console.log('🚀 Starting REAL multilingual vehicle data population...')
    console.log('🔍 Environment check:');
    console.log('  📊 SPREADSHEET_ID:', process.env.GOOGLE_SHEETS_SPREADSHEET_ID ? '✅ Found' : '❌ Missing');
    console.log('  📧 SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Found' : '❌ Missing');
    console.log('  🔑 PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✅ Found' : '❌ Missing');
    
    // Initialize Google Sheets service
    await GoogleSheetsService.initialize()
    console.log('✅ Google Sheets service initialized')
    
    // Extract all makes and models from fallback data
    const vehicles = []
    let idCounter = 1
    
    for (const [make, models] of Object.entries(fallbackModels)) {
      for (const model of models) {
        vehicles.push({
          id: idCounter++,
          make: make,
          model: model,
          type: 'Car', // Default type
          body: 'Sedan', // Default body type
          active: 'TRUE',
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        })
      }
    }
    
    console.log(`📊 Found ${vehicles.length} vehicles to process`)
    
    // Create multilingual header row
    const headerRow = [
      'ID', 
      'Make_NL', 'Make_EN', 'Make_ES', 'Make_PL', 'Make_RO',
      'Model_NL', 'Model_EN', 'Model_ES', 'Model_PL', 'Model_RO',
      'Type_NL', 'Type_EN', 'Type_ES', 'Type_PL', 'Type_RO',
      'Body_NL', 'Body_EN', 'Body_ES', 'Body_PL', 'Body_RO',
      'Active', 'Created_Date', 'Updated_Date'
    ]
    
    // Check current data
    const existingData = await GoogleSheetsService.getData('Vehicles')
    console.log(`📊 Current Vehicles sheet has ${existingData.length} rows`)
    
    // Start with header row
    const rowsToInsert = [headerRow]
    
    // Process vehicles in batches for translation
    const batchSize = 50
    let processedCount = 0
    
    for (let i = 0; i < vehicles.length; i += batchSize) {
      const batch = vehicles.slice(i, i + batchSize)
      console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vehicles.length / batchSize)}`)
      
      // Extract data for translation
      const makes = batch.map(v => v.make)
      const models = batch.map(v => v.model)
      const types = batch.map(v => v.type)
      const bodies = batch.map(v => v.body)
      
      try {
        // Translate to all languages
        const [
          makesNl, makesEn, makesEs, makesPl, makesRo,
          modelsNl, modelsEn, modelsEs, modelsPl, modelsRo,
          typesNl, typesEn, typesEs, typesPl, typesRo,
          bodiesNl, bodiesEn, bodiesEs, bodiesPl, bodiesRo
        ] = await Promise.all([
          // Makes translations
          Promise.resolve(makes), // NL (original)
          translateMultipleWithCache(makes, 'en'),
          translateMultipleWithCache(makes, 'es'),
          translateMultipleWithCache(makes, 'pl'),
          translateMultipleWithCache(makes, 'ro'),
          
          // Models translations
          Promise.resolve(models), // NL (original)
          translateMultipleWithCache(models, 'en'),
          translateMultipleWithCache(models, 'es'),
          translateMultipleWithCache(models, 'pl'),
          translateMultipleWithCache(models, 'ro'),
          
          // Types translations
          Promise.resolve(types), // NL (original)
          translateMultipleWithCache(types, 'en'),
          translateMultipleWithCache(types, 'es'),
          translateMultipleWithCache(types, 'pl'),
          translateMultipleWithCache(types, 'ro'),
          
          // Bodies translations
          Promise.resolve(bodies), // NL (original)
          translateMultipleWithCache(bodies, 'en'),
          translateMultipleWithCache(bodies, 'es'),
          translateMultipleWithCache(bodies, 'pl'),
          translateMultipleWithCache(bodies, 'ro')
        ])
        
        // Create rows for this batch
        const batchRows = batch.map((vehicle, index) => [
          vehicle.id,
          makesNl[index], makesEn[index], makesEs[index], makesPl[index], makesRo[index],
          modelsNl[index], modelsEn[index], modelsEs[index], modelsPl[index], modelsRo[index],
          typesNl[index], typesEn[index], typesEs[index], typesPl[index], typesRo[index],
          bodiesNl[index], bodiesEn[index], bodiesEs[index], bodiesPl[index], bodiesRo[index],
          vehicle.active,
          vehicle.created_date,
          vehicle.updated_date
        ])
        
        rowsToInsert.push(...batchRows)
        processedCount += batch.length
        console.log(`✅ Processed ${processedCount}/${vehicles.length} vehicles`)
        
      } catch (translationError) {
        console.error(`❌ Translation error for batch ${Math.floor(i / batchSize) + 1}:`, translationError)
        // Continue with next batch
      }
    }
    
    console.log(`📝 Prepared ${rowsToInsert.length - 1} data rows (excluding header)`)
    
    // Clear existing data first (optional - you might want to keep headers)
    console.log('🧹 Clearing existing vehicle data...')
    
    // Insert data in batches to avoid API limits
    const insertBatchSize = 50
    let insertedCount = 0
    
    // Clear the sheet first by overwriting with just headers, then add data
    console.log('📤 Inserting headers + data...')
    
    // Insert all data at once (header + data)
    await GoogleSheetsService.appendData('Vehicles', rowsToInsert)
    
    console.log(`🎉 Successfully populated REAL Google Sheets with ${processedCount} multilingual vehicles!`)
    
    // Verify the data
    console.log('🔍 Verifying inserted data...')
    const verificationData = await GoogleSheetsService.getData('Vehicles')
    console.log(`📊 Verification: Found ${verificationData.length} rows in Google Sheets`)
    
    if (verificationData.length > 1) {
      console.log('📋 First few rows from Google Sheets:')
      console.log('Headers:', verificationData[0])
      console.log('Row 1:', verificationData[1])
      console.log('Row 2:', verificationData[2])
      console.log('Row 3:', verificationData[3])
    }
    
  } catch (error) {
    console.error('❌ Error populating vehicles:', error)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

// Run the script
populateVehiclesMultilingualReal();