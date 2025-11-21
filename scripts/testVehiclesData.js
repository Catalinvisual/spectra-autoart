import GoogleSheetsService from '../server/src/services/googleSheetsService.js'

async function testVehiclesData() {
  try {
    console.log('Testing Google Sheets Vehicles data...')
    await GoogleSheetsService.initialize()
    
    const data = await GoogleSheetsService.getData('Vehicles')
    console.log(`📊 Total rows in Vehicles sheet: ${data.length}`)
    
    if (data.length > 0) {
      console.log('📋 Headers:', data[0])
      console.log('📋 First 5 data rows:')
      data.slice(1, 6).forEach((row, index) => {
        console.log(`Row ${index + 1}:`, row)
      })
      
      // Check for valid vehicle data
      const headers = data[0]
      const makeIndex = headers.indexOf('Make')
      const modelIndex = headers.indexOf('Model')
      
      let validVehicles = 0
      data.slice(1).forEach((row, index) => {
        const make = row[makeIndex]
        const model = row[modelIndex]
        if (make && model && make.trim() && model.trim()) {
          validVehicles++
        } else {
          console.log(`❌ Invalid row ${index + 2}: Make="${make}", Model="${model}"`)
        }
      })
      
      console.log(`✅ Found ${validVehicles} valid vehicles out of ${data.length - 1} total rows`)
    } else {
      console.log('❌ No data found in Vehicles sheet')
    }
  } catch (error) {
    console.error('Error testing vehicles data:', error)
  }
}

testVehiclesData()