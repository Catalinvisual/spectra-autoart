import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import auth from '../middleware/auth.js'
import GoogleSheetsService from '../services/googleSheetsService.js'
import { translateMultipleWithCache } from '../services/translationCacheService.js'

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

// Add new gallery image (admin only) - supports both file upload and URL
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    let imageUrl = ''
    
    // Handle file upload
    if (req.file) {
      // File was uploaded, use the file path
      imageUrl = `/uploads/gallery/${req.file.filename}`
      console.log(`📁 File uploaded: ${req.file.filename}`)
    } else if (req.body.url) {
      // URL was provided
      imageUrl = req.body.url
    } else {
      return res.status(400).json({ 
        success: false,
        error: 'Either image file or URL is required' 
      })
    }

    const { alt_text, category, active } = req.body

    const imageData = [
      Date.now().toString(), // ID
      imageUrl,
      alt_text || '',
      category || 'general',
      active !== undefined ? active.toString() : 'true',
      new Date().toISOString(), // Created_Date
      new Date().toISOString()  // Updated_Date
    ]

    const success = await GoogleSheetsService.appendData('Gallery', imageData)
    
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