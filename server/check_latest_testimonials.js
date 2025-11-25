import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '.env') })

console.log('🔍 Checking latest testimonials with proper environment...')

// Import services after env is loaded
const { default: GoogleSheetsService } = await import('./src/services/googleSheetsService.js')

async function checkLatestTestimonials() {
  try {
    // Ensure Google Sheets service is initialized
    if (!GoogleSheetsService.isInitialized) {
      console.log('🔄 Initializing Google Sheets service...')
      await GoogleSheetsService.initialize()
    }
    
    console.log('\n📊 Fetching latest testimonials from Google Sheets...')
    
    // Get all testimonials
    const allTestimonials = await GoogleSheetsService.getData('Testimonials')
    console.log(`✅ Found ${allTestimonials.length} total testimonials`);
    
    // Show the most recent 5 testimonials
    const recentTestimonials = allTestimonials.slice(-5)
    console.log('\n📝 Latest 5 testimonials:')
    
    recentTestimonials.forEach((testimonial, index) => {
      console.log(`\n${index + 1}. ID: ${testimonial[0]}`)
      console.log(`   Name: ${testimonial[1]}`)
      console.log(`   Rating: ${testimonial[2]}`)
      console.log(`   Comment_NL: ${testimonial[3]}`)
      console.log(`   Comment_EN: ${testimonial[4]}`)
      console.log(`   Comment_ES: ${testimonial[5]}`)
      console.log(`   Comment_PL: ${testimonial[6]}`)
      console.log(`   Comment_RO: ${testimonial[7]}`)
      console.log(`   Active: ${testimonial[8]}`)
      console.log(`   Date: ${testimonial[9]}`)
      
      // Check if translations are different (indicating successful translation)
      const originalLang = testimonial[7] === testimonial[3] ? 'RO' : 
                          testimonial[3] === testimonial[4] ? 'NL' :
                          testimonial[4] === testimonial[5] ? 'EN' :
                          testimonial[5] === testimonial[6] ? 'ES' : 'PL'
      
      const hasDifferentTranslations = ![
        testimonial[3] === testimonial[4], // NL === EN
        testimonial[4] === testimonial[5], // EN === ES
        testimonial[5] === testimonial[6], // ES === PL
        testimonial[6] === testimonial[7]  // PL === RO
      ].every(Boolean)
      
      console.log(`   Translation Status: ${hasDifferentTranslations ? '✅ Different translations' : '⚠️ All same text'}`)
      console.log(`   Likely Original: ${originalLang}`)
    })
    
    // Look specifically for "Test Debug" testimonials
    const testDebugTestimonials = allTestimonials.filter(t => t[1] && t[1].includes('Test Debug'))
    if (testDebugTestimonials.length > 0) {
      console.log(`\n🔍 Found ${testDebugTestimonials.length} "Test Debug" testimonials:`)
      testDebugTestimonials.forEach((testimonial, index) => {
        console.log(`\nTest Debug ${index + 1}:`)
        console.log(`   Name: ${testimonial[1]}`)
        console.log(`   Comment_NL: ${testimonial[3]}`)
        console.log(`   Comment_EN: ${testimonial[4]}`)
        console.log(`   Comment_ES: ${testimonial[5]}`)
        console.log(`   Comment_PL: ${testimonial[6]}`)
        console.log(`   Comment_RO: ${testimonial[7]}`)
        
        const hasDifferentTranslations = ![
          testimonial[3] === testimonial[4], // NL === EN
          testimonial[4] === testimonial[5], // EN === ES
          testimonial[5] === testimonial[6], // ES === PL
          testimonial[6] === testimonial[7]  // PL === RO
        ].every(Boolean)
        
        console.log(`   Translation Status: ${hasDifferentTranslations ? '✅ Different translations' : '⚠️ All same text'}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error checking testimonials:', error.message)
  }
}

// Run the check
checkLatestTestimonials()