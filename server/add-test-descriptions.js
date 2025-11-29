import GoogleSheetsService from './src/services/googleSheetsService.js'

async function addTestGalleryData() {
  console.log('🧪 Adding test gallery data with descriptions...')
  
  try {
    // Initialize Google Sheets service first
    console.log('🔧 Step 0: Initializing Google Sheets service...')
    const initialized = await GoogleSheetsService.initialize()
    if (!initialized) {
      console.warn('⚠️ Google Sheets service could not be initialized')
      return
    }
    console.log('✅ Google Sheets service initialized successfully')
    
    // Add test gallery data with descriptions
    console.log('➕ Adding test gallery data with descriptions...')
    
    const testGalleryItems = [
      ['samples/animals/cat', 'Beautiful Cat', 'A stunning photograph of a majestic cat in natural light', 'https://res.cloudinary.com/dnriqujfv/image/upload/v1764397493/samples/animals/cat.jpg', 'animals', 'true', new Date().toISOString()],
      ['samples/animals/kitten-playing', 'Playful Kitten', 'An adorable kitten playing with colorful toys', 'https://res.cloudinary.com/dnriqujfv/image/upload/v1764397498/samples/animals/kitten-playing.gif', 'animals', 'true', new Date().toISOString()],
      ['samples/animals/reindeer', 'Majestic Reindeer', 'A beautiful reindeer in its natural habitat during winter', 'https://res.cloudinary.com/dnriqujfv/image/upload/v1764397493/samples/animals/reindeer.jpg', 'animals', 'true', new Date().toISOString()]
    ]
    
    for (const item of testGalleryItems) {
      try {
        await GoogleSheetsService.appendData('Gallery', item)
        console.log(`✅ Added gallery item: ${item[0]} - ${item[1]}`)
      } catch (error) {
        console.warn(`⚠️ Could not add ${item[0]}:`, error.message)
      }
    }
    
    console.log('🎉 Test gallery data with descriptions added successfully!')
    
  } catch (error) {
    console.error('❌ Failed to add test gallery data:', error)
  }
}

addTestGalleryData()