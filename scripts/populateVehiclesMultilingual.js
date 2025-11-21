import GoogleSheetsService from '../server/src/services/googleSheetsService.js'
import { translateMultipleWithCache } from '../server/src/services/translationCacheService.js'
import { fallbackModels } from '../server/src/data/vehicleData.js'

async function populateVehiclesMultilingual() {
  try {
    console.log('🚀 Starting multilingual vehicle data population...')
    
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
    
    // Check if sheet has data and clear if needed
    const existingData = await GoogleSheetsService.getData('Vehicles')
    if (existingData.length > 0) {
      console.log(`🧹 Found existing data with ${existingData.length} rows, clearing...`)
      // Note: GoogleSheetsService doesn't have a clear method, so we'll append new data
      // In production, you might want to implement a clear/overwrite method
    }
    
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
    
    // Insert data in batches to avoid API limits
    const insertBatchSize = 50
    let insertedCount = 0
    
    for (let i = 0; i < rowsToInsert.length; i += insertBatchSize) {
      const batch = rowsToInsert.slice(i, i + insertBatchSize)
      
      if (i === 0) {
        // First batch includes header
        console.log('📤 Inserting header + first batch of data...')
        await GoogleSheetsService.appendData('Vehicles', batch)
      } else {
        console.log(`📤 Inserting batch ${Math.floor(i / insertBatchSize) + 1}/${Math.ceil(rowsToInsert.length / insertBatchSize)}`)
        await GoogleSheetsService.appendData('Vehicles', batch)
      }
      
      insertedCount += batch.length - (i === 0 ? 1 : 0) // Don't count header as data
      console.log(`✅ Inserted ${insertedCount}/${rowsToInsert.length - 1} vehicles`)
    }
    
    console.log(`🎉 Successfully populated Google Sheets with ${insertedCount} multilingual vehicles!`)
    
    // Verify the data
    console.log('🔍 Verifying inserted data...')
    const verificationData = await GoogleSheetsService.getData('Vehicles')
    console.log(`📊 Verification: Found ${verificationData.length} rows in Google Sheets`)
    
    if (verificationData.length > 1) {
      console.log('📋 First few rows from Google Sheets:')
      console.log('Headers:', verificationData[0])
      console.log('Row 1:', verificationData[1])
      console.log('Row 2:', verificationData[2])
    }
    
  } catch (error) {
    console.error('❌ Error populating vehicles:', error)
    process.exit(1)
  }
}

// Run the script
populateVehiclesMultilingual()