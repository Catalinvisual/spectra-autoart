import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '.env') })

console.log('🔍 Testing testimonial submission with proper environment...')

// Import services after env is loaded
const { default: GoogleSheetsService } = await import('./src/services/googleSheetsService.js')
const { translateMultipleWithDeepL, detectLanguageWithDeepL } = await import('./src/services/deeplTranslationService.js')

async function testCompleteTestimonialFlow() {
  try {
    // Ensure Google Sheets service is initialized
    if (!GoogleSheetsService.isInitialized) {
      console.log('🔄 Initializing Google Sheets service...')
      await GoogleSheetsService.initialize()
    }
    
    // Simulate the testimonial data from the user (Romanian text)
    const testimonialData = {
      name: 'Test Romanian User',
      rating: 5,
      comment: 'Servicii excelente! Recomand cu căldură această companie pentru profesionalismul și atenția la detalii.'
    }
    
    console.log('📝 Original testimonial:')
    console.log(`   Name: ${testimonialData.name}`)
    console.log(`   Rating: ${testimonialData.rating}`)
    console.log(`   Comment: ${testimonialData.comment}`)
    
    // Step 1: Detect language
    console.log('\n🔍 Step 1: Detecting language...')
    const detectedLanguage = await detectLanguageWithDeepL(testimonialData.comment)
    console.log(`   Detected language: ${detectedLanguage}`)
    
    // Step 2: Translate to all languages
    console.log('\n🔄 Step 2: Translating to all languages...')
    const translations = {}
    const targetLanguages = ['NL', 'EN', 'ES', 'PL', 'RO']
    
    // Initialize with original text
    for (const lang of targetLanguages) {
      translations[lang] = testimonialData.comment
    }
    
    // Translate to other languages (excluding detected language)
    const languagesToTranslate = targetLanguages.filter(lang => lang !== detectedLanguage)
    console.log(`   Languages to translate: ${languagesToTranslate.join(', ')}`)
    
    if (languagesToTranslate.length > 0) {
      const deeplTranslations = await translateMultipleWithDeepL(testimonialData.comment, languagesToTranslate, detectedLanguage)
      
      Object.entries(deeplTranslations).forEach(([lang, translation]) => {
        translations[lang] = translation
        console.log(`   ✅ Translated to ${lang}: ${translation}`)
      })
    }
    
    // Keep original for detected language
    translations[detectedLanguage] = testimonialData.comment
    console.log(`   ✅ Kept original for ${detectedLanguage}: ${testimonialData.comment}`)
    
    console.log('\n📋 Final translations:')
    Object.entries(translations).forEach(([lang, text]) => {
      console.log(`   ${lang}: "${text}"`)
    })
    
    // Step 3: Prepare data for Google Sheets
    console.log('\n📊 Step 3: Preparing data for Google Sheets...')
    const currentDate = new Date().toISOString().split('T')[0]
    const newTestimonial = [
      `test-${Date.now()}`,
      testimonialData.name,
      testimonialData.rating.toString(),
      translations['NL'],
      translations['EN'],
      translations['ES'],
      translations['PL'],
      translations['RO'],
      'true',
      currentDate
    ]
    
    console.log('📝 Testimonial data for Google Sheets:')
    console.log(`   ID: ${newTestimonial[0]}`)
    console.log(`   Name: ${newTestimonial[1]}`)
    console.log(`   Rating: ${newTestimonial[2]}`)
    console.log(`   Comment_NL: ${newTestimonial[3]}`)
    console.log(`   Comment_EN: ${newTestimonial[4]}`)
    console.log(`   Comment_ES: ${newTestimonial[5]}`)
    console.log(`   Comment_PL: ${newTestimonial[6]}`)
    console.log(`   Comment_RO: ${newTestimonial[7]}`)
    
    // Step 4: Save to Google Sheets
    console.log('\n💾 Step 4: Saving to Google Sheets...')
    await GoogleSheetsService.appendData('Testimonials', newTestimonial)
    console.log('✅ Successfully saved to Google Sheets!')
    
    console.log('\n🎉 Complete testimonial flow test finished successfully!')
    
  } catch (error) {
    console.error('❌ Error in complete testimonial flow:', error.message)
    console.error('Stack:', error.stack)
  }
}

// Run the test
testCompleteTestimonialFlow()