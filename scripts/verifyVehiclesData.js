import GoogleSheetsService from '../server/src/services/googleSheetsService.js'

async function verifyGoogleSheetsData() {
  try {
    console.log('🔍 Verifying Google Sheets Vehicles data...')
    
    await GoogleSheetsService.initialize()
    
    const data = await GoogleSheetsService.getData('Vehicles')
    console.log(`📊 Total rows in Vehicles sheet: ${data.length}`)
    
    if (data.length > 0) {
      console.log('📋 Headers:', data[0])
      
      // Check first 5 data rows
      const sampleRows = data.slice(1, 6)
      console.log('📋 Sample data rows:')
      sampleRows.forEach((row, index) => {
        console.log(`Row ${index + 2}:`, row)
      })
      
      // Verify column structure
      const headers = data[0]
      const requiredColumns = ['ID', 'Make', 'Model', 'Type', 'Body']
      const missingColumns = requiredColumns.filter(col => !headers.includes(col))
      
      if (missingColumns.length > 0) {
        console.log('❌ Missing columns:', missingColumns)
      } else {
        console.log('✅ All required columns found')
        
        // Count valid vehicles
        const makeIndex = headers.indexOf('Make')
        const modelIndex = headers.indexOf('Model')
        
        let validVehicles = 0
        data.slice(1).forEach((row, index) => {
          const make = row[makeIndex]
          const model = row[modelIndex]
          if (make && model && make.trim() && model.trim()) {
            validVehicles++
          }
        })
        
        console.log(`✅ Found ${validVehicles} valid vehicles out of ${data.length - 1} total rows`)
      }
    } else {
      console.log('❌ No data found in Vehicles sheet')
    }
  } catch (error) {
    console.error('❌ Error verifying Google Sheets data:', error)
  }
}

verifyGoogleSheetsData()