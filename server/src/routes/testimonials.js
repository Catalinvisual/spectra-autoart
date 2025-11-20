import { Router } from 'express'
import GoogleSheetsService from '../services/googleSheetsService.js'
import { translateMultipleWithCache } from '../services/translationCacheService.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { lang = 'nl' } = req.query
    
    // Get testimonials from Google Sheets
    const data = await GoogleSheetsService.getData('Testimonials')
    
    console.log('📊 Raw testimonials data from Google Sheets:', data)
    
    if (data.length <= 1) {
      console.log('⚠️ No testimonials data found or only header row exists')
      return res.json({
        success: true,
        data: []
      })
    }

    const headers = data[0]
    console.log('📋 Headers:', headers)
    
    // Create a mapping of headers to indices for easier access
    const headerMap = {};
    headers.forEach((header, index) => {
      headerMap[header.toLowerCase().replace(/ /g, '_')] = index;
    });
    
    console.log('🗺️ Header map:', headerMap);
    
    const testimonials = data.slice(1).map(row => {
      // Get the appropriate comment based on language with fallback logic
      let comment = '';
      
      // Încercăm să găsim comentariul în limba dorită
      const commentLangKey = headerMap[`comment_${lang}`];
      if (commentLangKey !== undefined && row[commentLangKey] && typeof row[commentLangKey] === 'string' && row[commentLangKey].trim() !== '') {
        comment = row[commentLangKey];
      } else if (headerMap.comment_nl !== undefined && row[headerMap.comment_nl] && typeof row[headerMap.comment_nl] === 'string' && row[headerMap.comment_nl].trim() !== '') {
        // Fallback la olandeză
        comment = row[headerMap.comment_nl];
      } else if (headerMap.comment !== undefined && row[headerMap.comment] && typeof row[headerMap.comment] === 'string' && row[headerMap.comment].trim() !== '') {
        // Fallback la comment generic
        comment = row[headerMap.comment];
      }
      
      // Get date from created_date or created_at with proper priority
      let dateValue = '';
      
      // Priority order for date sources:
      // 1. created_date (preferred - new structure)
      // 2. created_at (fallback)
      // 3. date (legacy fallback)
      
      if (headerMap.created_date !== undefined && row[headerMap.created_date] && row[headerMap.created_date] !== '') {
        dateValue = row[headerMap.created_date];
        console.log(`📅 Using created_date: ${dateValue}`)
      } else if (headerMap.created_at !== undefined && row[headerMap.created_at] && row[headerMap.created_at] !== '') {
        dateValue = row[headerMap.created_at];
        console.log(`📅 Using created_at: ${dateValue}`)
      } else if (headerMap.date !== undefined && row[headerMap.date] && row[headerMap.date] !== '') {
        dateValue = row[headerMap.date];
        console.log(`📅 Using date: ${dateValue}`)
      }
      
      // Extragem celelalte valori
      const name = (headerMap.name !== undefined && row[headerMap.name]) ? row[headerMap.name] : 'Unknown Client';
      const rating = (headerMap.rating !== undefined && row[headerMap.rating]) ? parseInt(row[headerMap.rating]) : 5;
      const id = (headerMap.id !== undefined && row[headerMap.id]) ? row[headerMap.id] : `test-${Date.now()}`;
      const service = (headerMap.service !== undefined && row[headerMap.service]) ? row[headerMap.service] : '';
      
      return {
        id: id,
        name: name,
        rating: rating,
        comment: comment,
        date: dateValue,
        service: service
      }
    }).filter(testimonial => testimonial.name && testimonial.comment && typeof testimonial.comment === 'string' && testimonial.comment.trim() !== '')

    console.log('✅ Processed testimonials:', testimonials)
    console.log('🔍 Filtered testimonials count:', testimonials.length)

    // Translate testimonials if language is not Dutch and we need translation
    let translatedTestimonials = testimonials
    if (lang !== 'nl') {
      try {
        // Check if we have translations in Google Sheets for this language
        const commentLangKey = `comment_${lang}`;
        const hasSheetTranslations = headers.some(h => h.toLowerCase() === commentLangKey);
        
        if (hasSheetTranslations) {
          console.log(`✅ Avem traduceri în Google Sheets pentru limba ${lang}, nu mai este nevoie de Google Translate`);
          translatedTestimonials = testimonials;
        } else {
          console.log(`🔄 Nu avem traduceri în Google Sheets pentru limba ${lang}, folosim Google Translate cu i18n fallback`);
          // Extract texts that need translation
          const namesToTranslate = testimonials.map(t => t.name)
          const textsToTranslate = testimonials.map(t => t.comment)
          const servicesToTranslate = testimonials.map(t => t.service)

          // Translate all texts with i18n fallback
          const [translatedNames, translatedTexts, translatedServices] = await Promise.all([
            translateMultipleWithCache(namesToTranslate, lang),
            translateMultipleWithCache(textsToTranslate, lang),
            translateMultipleWithCache(servicesToTranslate, lang)
          ])

          // Create translated testimonials
          translatedTestimonials = testimonials.map((testimonial, index) => ({
            ...testimonial,
            name: translatedNames[index] || testimonial.name,
            comment: translatedTexts[index] || testimonial.comment,
            service: translatedServices[index] || testimonial.service
          }))
        }
      } catch (translationError) {
        console.error('Translation error:', translationError)
        // Fallback to original testimonials
        translatedTestimonials = testimonials
      }
    }
    
    res.json({
      success: true,
      data: translatedTestimonials
    })
  } catch (error) {
    console.error('Error getting testimonials:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get testimonials'
    })
  }
})

// POST endpoint for submitting new testimonials
router.post('/', async (req, res) => {
  try {
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
    
    // Create new testimonial data with proper structure
    // ID, Name, Rating, Comment_NL, Comment_EN, Comment_ES, Comment_PL, Comment_RO, Active, Created_Date
    const newTestimonial = [
      `test-${Date.now()}`,    // ID
      name,                    // Name
      rating.toString(),       // Rating
      comment,                 // Comment_NL (comentariul original în olandeză)
      '',                      // Comment_EN (gol, nu salvăm date Excel aici)
      '',                      // Comment_ES (gol)
      '',                      // Comment_PL (gol)
      '',                      // Comment_RO (gol)
      'true',                  // Active
      currentDateOnly          // Created_Date (format YYYY-MM-DD)
    ]
    
    // Append to Google Sheets
    await GoogleSheetsService.appendData('Testimonials', newTestimonial)
    
    console.log('✅ New testimonial submitted successfully:', { name, rating, comment, date: currentDateOnly })
    
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