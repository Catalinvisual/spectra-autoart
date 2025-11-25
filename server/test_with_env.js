import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '.env') })

console.log('🔍 Environment variables loaded:')
console.log(`📊 DEEPL_KEY: ${process.env.DEEPL_KEY ? '✅ Present' : '❌ Missing'}`)
console.log(`📊 GOOGLE_SHEETS_SPREADSHEET_ID: ${process.env.GOOGLE_SHEETS_SPREADSHEET_ID}`)
console.log(`📊 GOOGLE_SERVICE_ACCOUNT_EMAIL: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`)
console.log(`📊 GOOGLE_PRIVATE_KEY: ${process.env.GOOGLE_PRIVATE_KEY ? '✅ Present' : '❌ Missing'}`)

// Now test the testimonial submission with proper environment
import('./src/services/googleSheetsService.js').then(async ({ default: GoogleSheetsService }) => {
  try {
    console.log('\n🔄 Initializing Google Sheets service with proper env...')
    await GoogleSheetsService.initialize()
    
    console.log('✅ Google Sheets service initialized successfully!')
    
    // Test testimonial saving
    console.log('\n📝 Testing testimonial saving...')
    const newTestimonial = [
      `test-${Date.now()}`,
      'Test User with Env',
      '5',
      'Deze service was uitstekend! Mijn auto ziet eruit als nieuw.',
      'This service was excellent! My car looks like new.',
      '¡Este servicio fue excelente! Mi auto parece nuevo.',
      'Ta usługa była doskonała! Mój samochód wygląda jak nowy.',
      'Acest serviciu a fost excelent! Mașina mea arată ca nouă.',
      'true',
      new Date().toISOString().split('T')[0]
    ]
    
    await GoogleSheetsService.appendData('Testimonials', newTestimonial)
    console.log('✅ Testimonial saved successfully with proper environment!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
})