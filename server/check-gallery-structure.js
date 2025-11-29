import GoogleSheetsService from './src/services/googleSheetsService.js'

async function checkGalleryStructure() {
  console.log('🔍 Checking gallery structure in Google Sheets...')
  
  try {
    // Initialize Google Sheets service first
    console.log('🔧 Initializing Google Sheets service...')
    const initialized = await GoogleSheetsService.initialize()
    if (!initialized) {
      console.warn('⚠️ Google Sheets service could not be initialized')
      return
    }
    console.log('✅ Google Sheets service initialized successfully')
    
    // Get gallery data
    console.log('📊 Getting gallery data from Google Sheets...')
    const galleryData = await GoogleSheetsService.getData('Gallery')
    
    console.log(`📊 Found ${galleryData.length} rows in Gallery sheet`)
    
    if (galleryData.length > 0) {
      console.log('📋 Headers:', galleryData[0])
      
      if (galleryData.length > 1) {
        console.log('\n📄 First 5 data rows:')
        galleryData.slice(1, 6).forEach((row, index) => {
          console.log(`  ${index + 1}. ID: "${row[0]}", Title: "${row[1]}", Description: "${row[2]}", Category: "${row[4]}", Active: "${row[5]}"`)
        })
      }
    }
    
    console.log('\n✅ Gallery structure check completed!')
    
  } catch (error) {
    console.error('❌ Gallery structure check failed:', error)
  }
}

checkGalleryStructure()