import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import auth from '../middleware/auth.js'
import GoogleSheetsService from '../services/googleSheetsService.js'
import { translateMultipleWithDeepL } from '../services/deeplTranslationService.js'


const router = Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/gallery'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `gallery-${uniqueSuffix}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF, WebP)'))
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
})

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const { lang = 'nl' } = req.query
    
    // Get gallery images from Google Sheets
    const data = await GoogleSheetsService.getData('Gallery')
    
    console.log('🖼️ Public Gallery - Google Sheets data:', JSON.stringify(data, null, 2))
    
    if (data.length <= 1) {
      console.log('🔄 Public Gallery empty or only headers')
      return res.json({ 
        success: true, 
        data: [] 
      })
    }

    const headers = data[0]
    console.log('📋 Public Gallery headers:', headers)
    
    const images = data.slice(1).map(row => {
      const image = {}
      headers.forEach((header, index) => {
        image[header.toLowerCase().replace(/ /g, '_')] = row[index] || ''
      })
      
      console.log('🖼️ Processing public gallery item:', JSON.stringify(image, null, 2))
      
      return {
        id: image.id || '',
        url: image.image_url || '',     // Image URL column
        alt_text: image.description || '', // Description column used as alt_text
        category: image.category || 'general',
        active: image.Active ? (image.Active.toLowerCase() === 'true') : true, // Default to true if Active column doesn't exist
        created_date: image.upload_date || '', // Upload Date column
        updated_date: image.upload_date || ''  // Upload Date column
      }
    }).filter(image => image.url && image.id)

    // Filter out images without valid URL (exclude simple words like "interior", "general")
    const filteredImages = images.filter(image => {
      const hasUrl = image.url && image.id
      const isValidUrl = image.url.includes('/') || image.url.startsWith('http') || image.url.endsWith('.jpg') || image.url.endsWith('.jpeg') || image.url.endsWith('.png') || image.url.endsWith('.gif') || image.url.endsWith('.webp')
      return hasUrl && isValidUrl
    })
    console.log('🔍 Filtered images (removed empty url/id):', filteredImages.length, 'from', images.length)
    
    // Translate gallery images if language is not Dutch
    let translatedImages = filteredImages
    if (lang !== 'nl') {
      try {
        // Extract alt_texts that need translation
        const altTextsToTranslate = filteredImages.map(img => img.alt_text)

        // Translate all alt_texts
        const translatedAltTextsResult = await translateMultipleWithDeepL(altTextsToTranslate.join('|'), [lang.toUpperCase()], 'nl');
        const translatedAltTexts = translatedAltTextsResult[lang.toUpperCase()]?.split('|') || altTextsToTranslate;

        // Create translated images
        translatedImages = filteredImages.map((image, index) => ({
          ...image,
          alt_text: translatedAltTexts[index] || image.alt_text
        }))
      } catch (translationError) {
        console.error('Translation error:', translationError)
        // Fallback to original images
        translatedImages = filteredImages
      }
    }
    
    console.log('✅ Final public gallery response:', JSON.stringify(translatedImages, null, 2))
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

// Add new gallery image (admin only) - supports both file upload and URL
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('🖼️ GALLERY ADD - Request received:', {
      body: req.body,
      file: req.file ? { filename: req.file.filename, path: req.file.path } : null
    })
    
    let imageUrl = ''
    
    // Handle file upload
    if (req.file) {
      // File was uploaded, use the file path
      imageUrl = `/uploads/gallery/${req.file.filename}`
      console.log(`📁 File uploaded: ${req.file.filename}`)
    } else if (req.body.url) {
      // URL was provided
      imageUrl = req.body.url
      console.log(`🔗 URL provided: ${imageUrl}`)
    } else {
      return res.status(400).json({ 
        success: false,
        error: 'Either image file or URL is required' 
      })
    }

    const { alt_text, category, active } = req.body
    console.log(`📝 Form data: alt_text="${alt_text}", category="${category}", active="${active}"`)

    const imageData = [
      Date.now().toString(), // ID
      imageUrl,              // Image URL
      alt_text || '',        // Description
      category || 'general', // Category
      active || 'true',      // Active
      new Date().toISOString() // Upload Date
    ]
    
    console.log('📊 Prepared image data for Google Sheets:', imageData)

    const success = await GoogleSheetsService.appendData('Gallery', imageData)
    console.log('✅ Google Sheets append result:', success)
    
    if (!success) {
      // If failed, delete the uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return res.status(500).json({ 
        success: false,
        error: 'Failed to add gallery image',
        demo: true 
      })
    }

    res.json({ 
      success: true, 
      message: 'Gallery image added successfully',
      data: { url: imageUrl }
    })
  } catch (error) {
    console.error('Error adding gallery image:', error)
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError)
      }
    }
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