import { Router } from 'express'
import auth from '../middleware/auth.js'
import GoogleSheetsService from '../services/googleSheetsService.js'
import { translateMultipleWithDeepL } from '../services/deeplTranslationService.js'


const router = Router()

// Public routes (no auth required)
router.get('/', async (req, res) => {
  try {
    const { lang = 'nl' } = req.query; // Get language from query parameter
    console.log(`🔄 Fetching services from Google Sheets for language: ${lang}...`)
    
    const data = await GoogleSheetsService.getData('Services')
    console.log('📊 Raw data from Google Sheets:', data)
    console.log('📊 Data length:', data.length)
    
    if (data.length <= 1) {
      console.log('⚠️  No services found or only header row')
      return res.json({ 
        success: true, 
        data: [] 
      })
    }

    const headers = data[0]
    console.log('📋 Headers:', headers)
    
    const services = await Promise.all(data.slice(1).map(async (row) => {
      const service = {}
      headers.forEach((header, index) => {
        service[header.toLowerCase().replace(/ /g, '_')] = row[index] || ''
      })
      
      console.log('🔍 Processing row:', row)
      console.log('🔍 Mapped service object:', service)
      
      // Get base text in Dutch (base language)
      const baseName = service.name_nl || row[1] || service.name_ro || row[5] || 'Service zonder naam';
      const baseDescription = service.description_nl || row[6] || service.description_ro || row[10] || '';
      
      // Translate if needed (and language is not Dutch)
      let finalName = baseName;
      let finalDescription = baseDescription;
      
      if (lang !== 'nl') {
        try {
          console.log(`🔄 Translating service to ${lang}: "${baseName}"`)
          const nameResult = await translateMultipleWithDeepL(baseName, [lang.toUpperCase()], 'nl');
          finalName = nameResult[lang.toUpperCase()] || baseName;
          
          if (baseDescription) {
            console.log(`🔄 Translating description to ${lang}: "${baseDescription.substring(0, 50)}..."`)
            const descResult = await translateMultipleWithDeepL(baseDescription, [lang.toUpperCase()], 'nl');
            finalDescription = descResult[lang.toUpperCase()] || baseDescription;
          }
        } catch (translationError) {
          console.error(`Error translating to ${lang}:`, translationError);
          finalName = baseName;
          finalDescription = baseDescription;
        }
      }
      
      const processedService = {
        id: service.id || row[0] || '',
        name: finalName,
        description: finalDescription,
        price: parseFloat(service.price || row[11]) || 0,
        duration: typeof row[12] === 'string' && row[12].match(/^\d+$/) ? row[12] : '60',
        category: typeof row[13] === 'string' && !row[13].includes('T') ? row[13] : 'general',
        image_url: typeof row[14] === 'string' && row[14].startsWith('http') ? row[14] : '',
        active: row[15] === 'true' || row[15] === true,
        original_name: baseName, // Keep original for reference
        original_description: baseDescription // Keep original for reference
      }
      
      console.log('🔍 Processed service:', processedService)
      return processedService
    }));
    
    // Filter out services without names
    const filteredServices = services.filter(service => service.name && service.name !== 'Service fără nume')
    
    console.log('✅ Final services count:', filteredServices.length)
    
    res.json({ 
      success: true, 
      data: filteredServices 
    })
  } catch (error) {
    console.error('Error getting services:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get services'
    })
  }
})

// Admin routes (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { 
      name_nl, name_en, name_es, name_pl, name_ro,
      description_nl, description_en, description_es, description_pl, description_ro,
      price, duration, category, image_url, active 
    } = req.body
    
    if (!name_nl || !price || !category) {
      return res.status(400).json({ 
        success: false,
        error: 'Dutch name, price and category are required' 
      })
    }

    const serviceData = [
      Date.now().toString(), // ID
      name_nl, name_en || name_nl, name_es || name_nl, name_pl || name_nl, name_ro || name_nl,
      description_nl, description_en || description_nl, description_es || description_nl, description_pl || description_nl, description_ro || description_nl,
      price.toString(),
      duration || '60',
      category,
      image_url || '',
      active !== undefined ? active.toString() : 'true',
      new Date().toISOString(), // Created_Date
      new Date().toISOString()  // Updated_Date
    ]

    const success = await GoogleSheetsService.appendData('Services', serviceData)
    
    if (!success) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to add service',
        demo: true 
      })
    }

    res.json({ 
      success: true, 
      message: 'Service added successfully' 
    })
  } catch (error) {
    console.error('Error adding service:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add service',
      demo: true 
    })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { 
      name_nl, name_en, name_es, name_pl, name_ro,
      description_nl, description_en, description_es, description_pl, description_ro,
      price, duration, category, image_url, active 
    } = req.body

    const data = await GoogleSheetsService.getData('Services')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No services found' 
      })
    }

    const rowIndex = data.slice(1).findIndex(row => row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Service not found' 
      })
    }

    const currentRow = data[rowIndex + 1]
    const updatedData = [
      id,
      name_nl || currentRow[1], name_en || currentRow[2], name_es || currentRow[3], name_pl || currentRow[4], name_ro || currentRow[5],
      description_nl || currentRow[6], description_en || currentRow[7], description_es || currentRow[8], description_pl || currentRow[9], description_ro || currentRow[10],
      price !== undefined ? price.toString() : currentRow[11],
      duration || currentRow[12],
      category || currentRow[13],
      image_url !== undefined ? image_url : currentRow[14],
      active !== undefined ? active.toString() : currentRow[15],
      currentRow[16], // Created_Date (keep original)
      new Date().toISOString() // Updated_Date
    ]

    const success = await GoogleSheetsService.updateData('Services', rowIndex, updatedData)
    
    if (!success) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to update service',
        demo: true 
      })
    }

    res.json({ 
      success: true, 
      message: 'Service updated successfully' 
    })
  } catch (error) {
    console.error('Error updating service:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update service',
      demo: true 
    })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params

    const data = await GoogleSheetsService.getData('Services')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No services found' 
      })
    }

    const rowIndex = data.slice(1).findIndex(row => row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Service not found' 
      })
    }

    const success = await GoogleSheetsService.deleteData('Services', rowIndex)
    
    if (!success) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to delete service',
        demo: true 
      })
    }

    res.json({ 
      success: true, 
      message: 'Service deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting service:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete service',
      demo: true 
    })
  }
})

export default router