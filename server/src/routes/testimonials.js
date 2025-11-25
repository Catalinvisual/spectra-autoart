import { Router } from 'express'
import GoogleSheetsService from '../services/googleSheetsService.js'

// Lazy load DeepL service to ensure environment variables are loaded first
let deeplService = null;
async function getDeepLService() {
  if (!deeplService) {
    const { translateMultipleWithDeepL, detectLanguageWithDeepL } = await import('../services/deeplTranslationService.js');
    deeplService = { translateMultipleWithDeepL, detectLanguageWithDeepL };
  }
  return deeplService;
}

const router = Router()

router.get('/', async (req, res) => {
  try {
    // Ensure Google Sheets service is initialized
    if (!GoogleSheetsService.isInitialized) {
      console.log('🔄 Initializing Google Sheets service...');
      await GoogleSheetsService.initialize();
    }
    
    const { lang = 'nl' } = req.query
    
    console.log('🎯 Server received testimonial request:', {
      lang: lang,
      query: req.query,
      url: req.url,
      method: req.method,
      headers: req.headers
    })
    
    // Get testimonials from Google Sheets using the DeepL translation method
    // Always use DeepL translation for Dutch (nl) and other languages
    const testimonials = await GoogleSheetsService.getTestimonialsWithDeepLTranslation(lang, true, true)
    
    console.log('📊 Testimonials data from Google Sheets:', testimonials)
    
    if (testimonials.length === 0) {
      console.log('⚠️ No testimonials data found')
      return res.json({
        success: true,
        data: []
      })
    }

    console.log('✅ Processed testimonials:', testimonials)
    console.log('🔍 Filtered testimonials count:', testimonials.length)
    
    console.log('✅ Server sending testimonial response:', {
      success: true,
      dataCount: testimonials.length,
      firstTestimonial: testimonials[0]
    })
    
    res.json({
      success: true,
      data: testimonials
    })
  } catch (error) {
    console.error('❌ Server error getting testimonials:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get testimonials'
    })
  }
})

// POST endpoint for submitting new testimonials
router.post('/', async (req, res) => {
  try {
    // Ensure Google Sheets service is initialized
    if (!GoogleSheetsService.isInitialized) {
      console.log('🔄 Initializing Google Sheets service...');
      await GoogleSheetsService.initialize();
    }
    
    const { name, rating, comment } = req.body
    
    // Validate input
    if (!name || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Name and comment are required'
      })
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      })
    }
    
    // Get current date in ISO format
    const currentDate = new Date().toISOString();
    const currentDateOnly = currentDate.split('T')[0]; // YYYY-MM-DD format
    
    // Detect language of the comment using DeepL
    const { detectLanguageWithDeepL } = await getDeepLService();
    const detectedSuffix = await detectLanguageWithDeepL(comment);
    console.log(`🔍 DeepL detected language: ${detectedSuffix} for comment: "${comment.substring(0, 50)}..."`);
    
    // Map detected language to column suffix (ensure it's in our expected format)
    const languageMap = {
      'EN': 'EN',
      'NL': 'NL', 
      'RO': 'RO',
      'ES': 'ES',
      'PL': 'PL'
    };
    
    const detectedLanguageCode = languageMap[detectedSuffix] || 'EN'; // Default to English if uncertain
    console.log(`📝 Will translate from ${detectedLanguageCode} to all languages`);
    
    // Translate to all languages using DeepL
    const translations = {};
    const targetLanguages = ['NL', 'EN', 'ES', 'PL', 'RO'];
    
    console.log(`🔄 Starting translation process for comment: "${comment}"`);
    console.log(`🎯 Target languages: ${targetLanguages.join(', ')}`);
    console.log(`🔍 Detected language code: ${detectedLanguageCode}`);
    
    // Initialize all languages with original text as fallback
    for (const lang of targetLanguages) {
      translations[lang] = comment;
      console.log(`📝 Initialized ${lang} with original: ${comment.substring(0, 50)}...`);
    }
    
    console.log(`📋 Initial translations object:`, JSON.stringify(translations, null, 2));
    
    // Use DeepL for translations (translate to all target languages)
    const languagesToTranslate = targetLanguages;
    
    if (languagesToTranslate.length > 0) {
      try {
        console.log(`🔄 Translating ${languagesToTranslate.length} languages with DeepL...`);
        
        // Use DeepL to translate to multiple languages
        const { translateMultipleWithDeepL } = await getDeepLService();
        const deeplTranslations = await translateMultipleWithDeepL(comment, languagesToTranslate, detectedLanguageCode);
        
        // Store translations
        Object.entries(deeplTranslations).forEach(([lang, translation]) => {
          translations[lang] = translation;
          console.log(`✅ DeepL translated to ${lang}: ${translation.substring(0, 50)}...`);
        });
        
        console.log(`📋 Translations object after DeepL:`, JSON.stringify(translations, null, 2));
        
      } catch (error) {
        console.error('❌ DeepL translation failed:', error);
        // Fallback: use original text for all remaining languages
        languagesToTranslate.forEach(lang => {
          translations[lang] = comment;
          console.log(`⚠️  Fallback: using original for ${lang}: ${comment.substring(0, 50)}...`);
        });
        console.log(`📋 Translations object after fallback:`, JSON.stringify(translations, null, 2));
      }
    }
    
    // Create new testimonial data with proper structure
    // ID, Name, Rating, Comment_NL, Comment_EN, Comment_ES, Comment_PL, Comment_RO, Active, Created_Date
    const newTestimonial = [
      `test-${Date.now()}`,    // ID
      name,                    // Name
      rating.toString(),       // Rating
      translations['NL'] || comment,  // Comment_NL
      translations['EN'] || comment,  // Comment_EN
      translations['ES'] || comment,  // Comment_ES
      translations['PL'] || comment,  // Comment_PL
      translations['RO'] || comment,  // Comment_RO
      'true',                  // Active
      currentDateOnly          // Created_Date (format YYYY-MM-DD)
    ]
    
    console.log('📤 Preparing to save testimonial to Google Sheets:');
    console.log(`   ID: ${newTestimonial[0]}`);
    console.log(`   Name: ${newTestimonial[1]}`);
    console.log(`   Rating: ${newTestimonial[2]}`);
    console.log(`   Comment_NL: ${newTestimonial[3]}`);
    console.log(`   Comment_EN: ${newTestimonial[4]}`);
    console.log(`   Comment_ES: ${newTestimonial[5]}`);
    console.log(`   Comment_PL: ${newTestimonial[6]}`);
    console.log(`   Comment_RO: ${newTestimonial[7]}`);
    console.log(`   Active: ${newTestimonial[8]}`);
    console.log(`   Created_Date: ${newTestimonial[9]}`);
    console.log(`📋 Final translations mapping:`);
    console.log(`   NL: "${translations['NL']}"`);
    console.log(`   EN: "${translations['EN']}"`);
    console.log(`   ES: "${translations['ES']}"`);
    console.log(`   PL: "${translations['PL']}"`);
    console.log(`   RO: "${translations['RO']}"`);
    
    // Append to Google Sheets
    await GoogleSheetsService.appendData('Testimonials', newTestimonial)
    
    console.log('✅ New testimonial submitted successfully:', { name, rating, comment: comment.substring(0, 50), date: currentDateOnly })
    
    res.json({
      success: true,
      message: 'Testimonial submitted successfully'
    })
  } catch (error) {
    console.error('❌ Error submitting testimonial:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to submit testimonial'
    })
  }
})

export default router