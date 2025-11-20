import { Router } from 'express'
import auth from '../middleware/auth.js'
import GoogleSheetsService from '../services/googleSheetsService.js'
import { translateMultipleWithCache } from '../services/translationCacheService.js'

const router = Router()

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const { lang = 'nl' } = req.query
    
    // Get gallery images from Google Sheets
    const data = await GoogleSheetsService.getData('Gallery')
    
    if (data.length <= 1) {
      return res.json({ 
        success: true, 
        data: [] 
      })
    }

    const headers = data[0]
    const images = data.slice(1).map(row => {
      const image = {}
      headers.forEach((header, index) => {
        image[header.toLowerCase().replace(/ /g, '_')] = row[index] || ''
      })
      
      return {
        id: image.id || '',
        url: image.url || '',
        alt_text: image.alt_text || '',
        category: image.category || 'general',
        active: image.active === 'true',
        created_date: image.created_date || '',
        updated_date: image.updated_date || ''
      }
    }).filter(image => image.url && image.id)

    // Translate gallery images if language is not Dutch
    let translatedImages = images
    if (lang !== 'nl') {
      try {
        // Extract alt_texts that need translation
        const altTextsToTranslate = images.map(img => img.alt_text)

        // Translate all alt_texts
        const translatedAltTexts = await translateMultipleWithCache(altTextsToTranslate, lang)

        // Create translated images
        translatedImages = images.map((image, index) => ({
          ...image,
          alt_text: translatedAltTexts[index] || image.alt_text
        }))
      } catch (translationError) {
        console.error('Translation error:', translationError)
        // Fallback to original images
        translatedImages = images
      }
    }
    
    res.json({ 
      success: true, 
      data: translatedImages 
    })
  } catch (error) {
    console.error('Error getting gallery images:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get gallery images'
    })
  }
})

// Add new gallery image (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { url, alt_text, category, active } = req.body
    
    if (!url) {
      return res.status(400).json({ 
        success: false,
        error: 'Image URL is required' 
      })
    }

    const imageData = [
      Date.now().toString(), // ID
      url,
      alt_text || '',
      category || 'general',
      active !== undefined ? active.toString() : 'true',
      new Date().toISOString(), // Created_Date
      new Date().toISOString()  // Updated_Date
    ]

    const success = await GoogleSheetsService.appendData('Gallery', imageData)
    
    if (!success) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to add gallery image',
        demo: true 
      })
    }

    res.json({ 
      success: true, 
      message: 'Gallery image added successfully' 
    })
  } catch (error) {
    console.error('Error adding gallery image:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add gallery image',
      demo: true 
    })
  }
})

// Update gallery image (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { url, alt_text, category, active } = req.body

    const data = await GoogleSheetsService.getData('Gallery')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No gallery images found' 
      })
    }

    const rowIndex = data.slice(1).findIndex(row => row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Gallery image not found' 
      })
    }

    const currentRow = data[rowIndex + 1]
    const updatedData = [
      id,
      url !== undefined ? url : currentRow[1],
      alt_text !== undefined ? alt_text : currentRow[2],
      category || currentRow[3],
      active !== undefined ? active.toString() : currentRow[4],
      currentRow[5], // Created_Date (keep original)
      new Date().toISOString() // Updated_Date
    ]

    const success = await GoogleSheetsService.updateData('Gallery', rowIndex, updatedData)
    
    if (!success) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to update gallery image',
        demo: true 
      })
    }

    res.json({ 
      success: true, 
      message: 'Gallery image updated successfully' 
    })
  } catch (error) {
    console.error('Error updating gallery image:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update gallery image',
      demo: true 
    })
  }
})

// Delete gallery image (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params

    const data = await GoogleSheetsService.getData('Gallery')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No gallery images found' 
      })
    }

    const rowIndex = data.slice(1).findIndex(row => row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Gallery image not found' 
      })
    }

    const success = await GoogleSheetsService.deleteData('Gallery', rowIndex)
    
    if (!success) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to delete gallery image',
        demo: true 
      })
    }

    res.json({ 
      success: true, 
      message: 'Gallery image deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting gallery image:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete gallery image',
      demo: true 
    })
  }
})

export default router