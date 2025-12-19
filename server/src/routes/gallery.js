import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import auth from '../middleware/auth.js'
import GoogleSheetsService from '../services/googleSheetsService.js'
import GoogleDriveService from '../services/googleDriveService.js'
import CloudinaryService from '../services/cloudinaryService.js'
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
    let driveFileId = ''
    let useGoogleDrive = false
    
    // Handle file upload to Cloudinary (preferred) or Google Drive
    if (req.file) {
      console.log(`📁 Processing uploaded file: ${req.file.filename}`)
      
      // Try to upload to Cloudinary first (preferred)
      const uploadResult = await CloudinaryService.uploadImage(
        req.file.path,
        req.file.filename
      )
      
      if (uploadResult.success) {
        // Cloudinary upload successful
        imageUrl = uploadResult.webViewLink
        driveFileId = uploadResult.fileId
        useGoogleDrive = false // Now using Cloudinary
        console.log(`✅ File uploaded to Cloudinary: ${imageUrl}`)
        
        // Clean up local file after successful upload
        try {
          fs.unlinkSync(req.file.path)
        } catch (cleanupError) {
          console.warn('⚠️ Could not delete temp file:', cleanupError.message)
        }
      } else {
        // Cloudinary upload failed - fallback to Google Drive
        console.warn(`⚠️ Cloudinary upload failed: ${uploadResult.error}`)
        console.log(`📁 Falling back to Google Drive`)
        
        const driveUploadResult = await GoogleDriveService.uploadImage(
          req.file.path,
          req.file.filename
        )
        
        if (driveUploadResult.success) {
          imageUrl = driveUploadResult.webViewLink
          driveFileId = driveUploadResult.fileId
          useGoogleDrive = true
          console.log(`✅ File uploaded to Google Drive: ${imageUrl}`)
          
          // Clean up local file after successful upload
          try {
            fs.unlinkSync(req.file.path)
          } catch (cleanupError) {
            console.warn('⚠️ Could not delete temp file:', cleanupError.message)
          }
        } else {
          // Both failed - use local storage as final fallback
          console.warn(`⚠️ Google Drive upload also failed: ${driveUploadResult.error}`)
          console.log(`💾 Falling back to local storage`)
          
          const relativePath = `/uploads/gallery/${req.file.filename}`
          imageUrl = relativePath
          console.log(`💾 File stored locally: ${imageUrl}`)
        }
      }
      
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

    const { alt_text, category, active, title } = req.body
    console.log(`📝 Form data: title="${title}", alt_text="${alt_text}", category="${category}", active="${active}"`)

    // Traducem automat titlul și descrierea în toate limbile folosind DeepL
    const originalTitle = title || alt_text || 'Gallery Image'
    const originalDescription = alt_text || ''
    
    console.log(`🔄 Starting DeepL translation for title: "${originalTitle}" and description: "${originalDescription}"`)
    
    let translations = {
      Title_NL: originalTitle,
      Title_EN: originalTitle,
      Title_ES: originalTitle,
      Title_PL: originalTitle,
      Title_RO: originalTitle,
      Description_NL: originalDescription,
      Description_EN: originalDescription,
      Description_ES: originalDescription,
      Description_PL: originalDescription,
      Description_RO: originalDescription
    }
    
    try {
      // Traducem titlul în toate limbile
      if (originalTitle) {
        const titleTranslations = await translateMultipleWithDeepL(originalTitle, ['EN', 'ES', 'PL', 'RO'], 'NL')
        translations.Title_EN = titleTranslations.EN || originalTitle
        translations.Title_ES = titleTranslations.ES || originalTitle
        translations.Title_PL = titleTranslations.PL || originalTitle
        translations.Title_RO = titleTranslations.RO || originalTitle
        console.log(`✅ Title translations completed: NL="${originalTitle}", EN="${translations.Title_EN}", ES="${translations.Title_ES}", PL="${translations.Title_PL}", RO="${translations.Title_RO}"`)
      }
      
      // Traducem descrierea în toate limbile
      if (originalDescription) {
        const descriptionTranslations = await translateMultipleWithDeepL(originalDescription, ['EN', 'ES', 'PL', 'RO'], 'NL')
        translations.Description_EN = descriptionTranslations.EN || originalDescription
        translations.Description_ES = descriptionTranslations.ES || originalDescription
        translations.Description_PL = descriptionTranslations.PL || originalDescription
        translations.Description_RO = descriptionTranslations.RO || originalDescription
        console.log(`✅ Description translations completed: NL="${originalDescription}", EN="${translations.Description_EN}", ES="${translations.Description_ES}", PL="${translations.Description_PL}", RO="${translations.Description_RO}"`)
      }
      
    } catch (translationError) {
      console.error('❌ DeepL translation failed:', translationError)
      // Folosim textul original ca fallback pentru toate traducerile
    }

    // Preparăm datele complete pentru Google Sheets cu toate traducerile
    const imageData = [
      Date.now().toString(),    // ID
      originalTitle,            // Title (coloana 2)
      originalDescription,      // Description (coloana 3)
      imageUrl,                 // Image URL (coloana 4)
      category || 'general',    // Category (coloana 5)
      active || 'true',         // Active (coloana 6)
      new Date().toISOString(), // Upload Date (coloana 7)
      translations.Title_NL,    // Title_NL (coloana 8)
      translations.Title_EN,    // Title_EN (coloana 9)
      translations.Title_ES,    // Title_ES (coloana 10)
      translations.Title_PL,    // Title_PL (coloana 11)
      translations.Title_RO,    // Title_RO (coloana 12)
      translations.Description_NL, // Description_NL (coloana 13)
      translations.Description_EN, // Description_EN (coloana 14)
      translations.Description_ES, // Description_ES (coloana 15)
      translations.Description_PL, // Description_PL (coloana 16)
      translations.Description_RO  // Description_RO (coloana 17)
    ]
    
    console.log('📊 Prepared complete image data for Google Sheets with translations:', imageData)

    const success = await GoogleSheetsService.appendData('Gallery', imageData)
    console.log('✅ Google Sheets append result:', success)
    
    if (!success) {
      // If Google Sheets failed, try to delete the uploaded file from Drive
      if (driveFileId) {
        try {
          await GoogleDriveService.deleteImage(driveFileId)
        } catch (deleteError) {
          console.warn('⚠️ Could not delete file from Google Drive:', deleteError.message)
        }
      }
      
      return res.status(500).json({ 
        success: false,
        error: 'Failed to add gallery image to database',
        demo: true 
      })
    }

    res.json({ 
      success: true, 
      message: 'Gallery image added successfully',
      data: { url: imageUrl, driveFileId: driveFileId }
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
    const { url, alt_text, category, active, title } = req.body

    const data = await GoogleSheetsService.getData('Gallery')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No gallery images found' 
      })
    }

    const rowIndex = data.slice(1).findIndex(row => row[0] === Number(id))
    
    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Gallery image not found' 
      })
    }

    const currentRow = data[rowIndex + 1]
    const currentImageUrl = currentRow[3] // Current image URL
    
    // If URL is being changed, clean up the old image
    if (url && url !== currentImageUrl) {
      // Handle Cloudinary cleanup
      if (currentImageUrl.includes('res.cloudinary.com')) {
        try {
          // Extrage public_id din URL Cloudinary
          const urlParts = currentImageUrl.split('/')
          const versionIndex = urlParts.findIndex(part => part.startsWith('v'))
          if (versionIndex !== -1) {
            const publicIdWithExtension = urlParts.slice(versionIndex + 1).join('/')
            const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '') // Remove extension
            
            await CloudinaryService.deleteImage(`spectra-autoart/gallery/${publicId}`)
            console.log(`✅ Deleted old image from Cloudinary: ${publicId}`)
          }
        } catch (cloudinaryError) {
          console.warn('⚠️ Could not delete old image from Cloudinary:', cloudinaryError.message)
        }
      }
      // Handle Google Drive cleanup
      else if (currentImageUrl.includes('drive.google.com')) {
        const oldFileId = GoogleDriveService.extractFileIdFromUrl(currentImageUrl)
        if (oldFileId) {
          try {
            await GoogleDriveService.deleteImage(oldFileId)
            console.log(`✅ Deleted old image from Google Drive: ${oldFileId}`)
          } catch (driveError) {
            console.warn('⚠️ Could not delete old image from Google Drive:', driveError.message)
          }
        }
      }
      // Handle local file cleanup (optional - you might want to keep local files)
      else if (currentImageUrl.includes('/uploads/')) {
        // For now, we'll keep local files to avoid accidental deletions
        console.log(`ℹ️ Local file cleanup skipped for: ${currentImageUrl}`)
      }
    }
    
    // Preluăm valorile actuale sau folosim cele noi
    const currentTitle = currentRow[1] || ''
    const currentDescription = currentRow[2] || ''
    const newTitle = title !== undefined ? title : currentTitle
    const newDescription = alt_text !== undefined ? alt_text : currentDescription
    
    // Dacă titlul sau descrierea s-au schimbat, regenerăm traducerile
    let translations = {
      Title_NL: currentRow[7] || newTitle,
      Title_EN: currentRow[8] || newTitle,
      Title_ES: currentRow[9] || newTitle,
      Title_PL: currentRow[10] || newTitle,
      Title_RO: currentRow[11] || newTitle,
      Description_NL: currentRow[12] || newDescription,
      Description_EN: currentRow[13] || newDescription,
      Description_ES: currentRow[14] || newDescription,
      Description_PL: currentRow[15] || newDescription,
      Description_RO: currentRow[16] || newDescription
    }
    
    // Dacă s-au făcut modificări la titlu sau descriere, regenerăm traducerile
    if (title !== undefined || alt_text !== undefined) {
      console.log(`🔄 Regenerating translations due to content changes...`)
      
      try {
        // Traducem titlul în toate limbile
        if (newTitle) {
          const titleTranslations = await translateMultipleWithDeepL(newTitle, ['EN', 'ES', 'PL', 'RO'], 'NL')
          translations.Title_EN = titleTranslations.EN || newTitle
          translations.Title_ES = titleTranslations.ES || newTitle
          translations.Title_PL = titleTranslations.PL || newTitle
          translations.Title_RO = titleTranslations.RO || newTitle
          translations.Title_NL = newTitle // NL rămâne originalul
          console.log(`✅ Title translations updated: NL="${newTitle}", EN="${translations.Title_EN}", ES="${translations.Title_ES}", PL="${translations.Title_PL}", RO="${translations.Title_RO}"`)
        }
        
        // Traducem descrierea în toate limbile
        if (newDescription) {
          const descriptionTranslations = await translateMultipleWithDeepL(newDescription, ['EN', 'ES', 'PL', 'RO'], 'NL')
          translations.Description_EN = descriptionTranslations.EN || newDescription
          translations.Description_ES = descriptionTranslations.ES || newDescription
          translations.Description_PL = descriptionTranslations.PL || newDescription
          translations.Description_RO = descriptionTranslations.RO || newDescription
          translations.Description_NL = newDescription // NL rămâne originalul
          console.log(`✅ Description translations updated: NL="${newDescription}", EN="${translations.Description_EN}", ES="${translations.Description_ES}", PL="${translations.Description_PL}", RO="${translations.Description_RO}"`)
        }
        
      } catch (translationError) {
        console.error('❌ DeepL translation failed during update:', translationError)
        // Folosim textul original ca fallback pentru toate traducerile
      }
    }
    
    const updatedData = [
      id,
      newTitle,                    // Title (coloana 2)
      newDescription,            // Description (coloana 3)
      url !== undefined ? url : currentImageUrl, // Use new URL or keep current
      category || currentRow[4],
      active !== undefined ? active.toString() : currentRow[5],
      currentRow[6],             // Created_Date (keep original)
      translations.Title_NL,     // Title_NL (coloana 8)
      translations.Title_EN,     // Title_EN (coloana 9)
      translations.Title_ES,     // Title_ES (coloana 10)
      translations.Title_PL,     // Title_PL (coloana 11)
      translations.Title_RO,     // Title_RO (coloana 12)
      translations.Description_NL, // Description_NL (coloana 13)
      translations.Description_EN, // Description_EN (coloana 14)
      translations.Description_ES, // Description_ES (coloana 15)
      translations.Description_PL, // Description_PL (coloana 16)
      translations.Description_RO,  // Description_RO (coloana 17)
      new Date().toISOString()   // Updated_Date (coloana 18)
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

    const rowIndex = data.slice(1).findIndex(row => row[0] === Number(id))
    
    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Gallery image not found' 
      })
    }

    // Get the image URL before deletion to clean up storage
    const imageRow = data[rowIndex + 1]
    const imageUrl = imageRow[3] // Image URL column
    
    // Clean up based on storage type
    if (imageUrl) {
      if (imageUrl.includes('res.cloudinary.com')) {
        // Delete from Cloudinary
        try {
          // Extrage public_id din URL Cloudinary
          const urlParts = imageUrl.split('/')
          const versionIndex = urlParts.findIndex(part => part.startsWith('v'))
          if (versionIndex !== -1) {
            const publicIdWithExtension = urlParts.slice(versionIndex + 1).join('/')
            const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '') // Remove extension
            
            await CloudinaryService.deleteImage(`spectra-autoart/gallery/${publicId}`)
            console.log(`✅ Deleted image from Cloudinary: ${publicId}`)
          }
        } catch (cloudinaryError) {
          console.warn('⚠️ Could not delete image from Cloudinary:', cloudinaryError.message)
        }
      } else if (imageUrl.includes('drive.google.com')) {
        // Try to extract Google Drive file ID and delete from Drive
        const fileId = GoogleDriveService.extractFileIdFromUrl(imageUrl)
        if (fileId) {
          try {
            await GoogleDriveService.deleteImage(fileId)
            console.log(`✅ Deleted image from Google Drive: ${fileId}`)
          } catch (driveError) {
            console.warn('⚠️ Could not delete image from Google Drive:', driveError.message)
          }
        }
      } else if (imageUrl.includes('/uploads/')) {
        // Handle local file deletion (optional - you might want to keep local files)
        console.log(`ℹ️ Local file cleanup skipped for: ${imageUrl}`)
        // Uncomment the following lines if you want to delete local files:
        // try {
        //   const localPath = path.join(__dirname, '..', imageUrl)
        //   fs.unlinkSync(localPath)
        //   console.log(`✅ Deleted local file: ${localPath}`)
        // } catch (localError) {
        //   console.warn('⚠️ Could not delete local file:', localError.message)
        // }
      }
    }

    const success = await GoogleSheetsService.deleteData('Gallery', rowIndex)
    
    if (!success) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to delete gallery image from database',
        demo: true 
      })
    }

    res.json({ 
      success: true, 
      message: 'Gallery image deleted successfully from database and Google Drive' 
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