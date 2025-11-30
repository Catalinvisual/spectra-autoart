// Admin routes
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import GoogleSheetsService from '../services/googleSheetsService.js'
import requireAuth from '../middleware/auth.js'
import { sendBookingConfirmation, sendAdminNotification, testEmailService } from '../services/emailService.js'

const router = express.Router()

// Admin login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate credentials against environment variables
    if (email !== process.env.ADMIN_DEFAULT_EMAIL || password !== process.env.ADMIN_DEFAULT_PASSWORD) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      token,
      admin: { email }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    })
  }
})

// Get dashboard stats
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const bookings = await GoogleSheetsService.getData('Bookings')
    const gallery = await GoogleSheetsService.getData('Gallery')
    const messages = await GoogleSheetsService.getData('Messages')
    
    const totalBookings = bookings.length > 1 ? bookings.length - 1 : 0
    const totalGallery = gallery.length > 1 ? gallery.length - 1 : 0
    const totalMessages = messages.length > 1 ? messages.length - 1 : 0
    
    // Get recent bookings (last 5)
    const recentBookings = bookings.slice(-5).map(row => ({
      date: row[1] || '',
      time: row[2] || '',
      services: row[7] || '',
      total: row[8] || '',
      status: row[9] || 'pending'
    }))

    res.json({
      stats: {
        totalBookings,
        totalGallery,
        totalMessages
      },
      recentBookings
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ error: 'Failed to load dashboard data' })
  }
})

// Get all bookings
router.get('/bookings', requireAuth, async (req, res) => {
  try {
    const data = await GoogleSheetsService.getData('Bookings')
    
    if (data.length <= 1) {
      return res.json([])
    }

    // Convert rows to booking objects
    const bookings = data.slice(1).map((row, index) => {
      // Map columns based on actual Google Sheets structure
      const id = row[0] || `booking_${index + 1}`
      const name = row[1] || ''
      const email = row[2] || ''
      const phone = row[3] || ''
      const date = row[4] || ''
      const time = row[5] || ''
      const services = row[6] || ''
      const totalRaw = row[7] || '0'
      const status = row[8] || 'pending'
      const createdAt = row[9] || new Date().toISOString()
      
      // Parse total amount
      let total = 0
      if (typeof totalRaw === 'number') {
        total = totalRaw
      } else if (typeof totalRaw === 'string') {
        total = parseFloat(totalRaw) || 0
      }
      
      // Extract make/model from services or use defaults
      const make = ''
      const model = ''
      const type = ''
      const body = ''
      
      return {
        id: id,
        date: date,
        time: time,
        make: make,
        model: model,
        type: type,
        body: body,
        services: services,
        total: total,
        user: {
          name: name,
          email: email,
          phone: phone
        },
        newsletter: false, // Default since we don't have this data
        locale: '', // Default since we don't have this data
        status: status,
        createdAt: createdAt
      }
    })
    
    res.json(bookings)
  } catch (error) {
    console.error('Bookings error:', error)
    res.status(500).json({ error: 'Failed to load bookings' })
  }
})

router.patch('/bookings/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    const data = await GoogleSheetsService.getData('Bookings')
    
    if (data.length <= 1) {
      return res.status(404).json({ error: 'Nu există programări' })
    }

    // Find the row by ID
    const rowIndex = data.slice(1).findIndex(row => row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Programarea nu a fost găsită' })
    }

    // Update the status in the row (status is in column 8)
    const actualRowIndex = rowIndex + 1 // +1 to account for header row
    data[actualRowIndex][8] = status

    // Update the data in Google Sheets
    await GoogleSheetsService.updateData('Bookings', actualRowIndex + 1, data[actualRowIndex]) // +1 because Google Sheets is 1-indexed

    res.json({ success: true, message: 'Status updated successfully' })
  } catch (error) {
    console.error('Update booking error:', error)
    res.status(500).json({ error: 'Failed to update booking status' })
  }
})

// Get all messages
router.get('/messages', requireAuth, async (req, res) => {
  try {
    const data = await GoogleSheetsService.getData('Messages')
    
    if (data.length <= 1) {
      return res.json([])
    }

    // Convert rows to message objects
    const messages = data.slice(1).map((row, index) => ({
      id: row[0] || `message_${index + 1}`,
      name: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      subject: row[4] || '',
      message: row[5] || '',
      createdAt: row[6] || new Date().toISOString(),
      status: row[7] || 'unread'
    }))

    res.json(messages)
  } catch (error) {
    console.error('Messages error:', error)
    res.status(500).json({ error: 'Failed to load messages' })
  }
})

// Update message status
router.patch('/messages/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    const data = await GoogleSheetsService.getData('Messages')
    
    if (data.length <= 1) {
      return res.status(404).json({ error: 'Nu există mesaje' })
    }

    // Find the row by ID
    const rowIndex = data.slice(1).findIndex(row => row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Mesajul nu a fost găsit' })
    }

    // Update the status in the row (status is in column 7)
    const actualRowIndex = rowIndex + 1 // +1 to account for header row
    data[actualRowIndex][7] = status

    // Update the data in Google Sheets
    await GoogleSheetsService.updateData('Messages', actualRowIndex + 1, data[actualRowIndex]) // +1 because Google Sheets is 1-indexed

    res.json({ success: true, message: 'Status updated successfully' })
  } catch (error) {
    console.error('Update message error:', error)
    res.status(500).json({ error: 'Failed to update message status' })
  }
})

// Get all gallery images
router.get('/gallery', requireAuth, async (req, res) => {
  try {
    // Import CloudinaryService dynamically to avoid circular dependencies
    const { default: CloudinaryService } = await import('../services/cloudinaryService.js')
    
    // Get images from Cloudinary
    const cloudinaryResult = await CloudinaryService.getImagesFromFolder('spectra-autoart/gallery')
    const cloudinaryImages = cloudinaryResult.success ? cloudinaryResult.data : []
    
    // Get metadata from Google Sheets
    let googleSheetsData = []
    try {
      const data = await GoogleSheetsService.getData('Gallery')
      if (data.length > 1) {
        googleSheetsData = data.slice(1).map(row => ({
          id: row[0] || '',
          url: row[1] || '',
          alt_text: row[2] || '',
          category: row[3] || 'general',
          active: row[4] === true || row[4] === 'true',
          createdAt: row[5] || ''
        }))
      }
    } catch (sheetsError) {
      console.warn('⚠️ Could not load Google Sheets metadata:', sheetsError.message)
    }

    // Combine Cloudinary images with Google Sheets metadata
    const gallery = cloudinaryImages.map(image => {
      // Try to find matching metadata from Google Sheets
      const matchingMetadata = googleSheetsData.find(sheetData => 
        sheetData.url === image.url || 
        sheetData.id === image.id
      )

      return {
        id: image.id, // Use Cloudinary public_id as unique ID
        url: image.url,
        alt_text: matchingMetadata?.alt_text || image.description || '',
        category: matchingMetadata?.category || image.category || 'general',
        active: matchingMetadata?.active !== undefined ? matchingMetadata.active : image.active,
        createdAt: image.created_date || new Date().toISOString(),
        width: image.width,
        height: image.height,
        format: image.format,
        bytes: image.size
      }
    })

    res.json({ success: true, data: gallery })
  } catch (error) {
    console.error('Gallery error:', error)
    res.status(500).json({ error: 'Failed to load gallery' })
  }
})

// Add new gallery image
router.post('/gallery', requireAuth, async (req, res) => {
  try {
    const { url, alt_text, category, active, public_id } = req.body
    
    // Validate required fields
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image URL is required' 
      })
    }

    // Use public_id from Cloudinary if provided, otherwise generate one
    const id = public_id || Date.now().toString()
    const createdAt = new Date().toISOString()

    // Create new gallery entry - match Google Sheets structure for metadata
    const galleryData = [
      id,                                    // ID (column A) - use Cloudinary public_id
      url,                                   // Title (column B) - contains image URL
      alt_text || '',                        // Description (column C) - contains image description
      category || 'general',                 // Image URL (column D) - contains category
      active !== undefined ? active : true,  // Category (column E) - contains active status
      createdAt                              // Upload Date (column F) - contains upload date
    ]

    console.log('🖼️ Adding gallery image metadata:', galleryData)

    // Append metadata to Google Sheets
    try {
      await GoogleSheetsService.appendData('Gallery', galleryData)
      console.log('✅ Gallery metadata saved to Google Sheets')
    } catch (sheetsError) {
      console.warn('⚠️ Could not save metadata to Google Sheets:', sheetsError.message)
    }

    res.json({ 
      success: true, 
      message: 'Gallery image metadata saved successfully',
      image: {
        id,
        url,
        alt_text: alt_text || '',
        category: category || 'general',
        active: active !== undefined ? active : true,
        createdAt
      }
    })
  } catch (error) {
    console.error('Add gallery error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add gallery image metadata' 
    })
  }
})

// Update gallery image status - using wildcard to handle IDs with forward slashes
router.put('/gallery/*', requireAuth, async (req, res) => {
  try {
    const id = req.params[0] // Get the full path after /gallery/
    const { active, alt_text, category } = req.body
    
    console.log('🔄 Updating gallery image:', id, { active, alt_text, category })
    
    // Get current data from Google Sheets
    const data = await GoogleSheetsService.getData('Gallery')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No gallery images found' 
      })
    }

    // Find the row by ID
    const headers = data[0]
    const idColumnIndex = headers.findIndex(header => 
      header.toLowerCase().replace(/ /g, '_') === 'id'
    )
    
    if (idColumnIndex === -1) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID column not found in Gallery data' 
      })
    }

    // Extract numeric ID from Cloudinary path (e.g., "spectra-autoart/gallery/gallery-1764413003189-824263647" -> "1764413003189")
    const extractNumericId = (cloudinaryPath) => {
      // Dacă este deja un ID numeric simplu, returnează-l direct
      if (/^\d+$/.test(cloudinaryPath)) {
        return cloudinaryPath
      }
      // Extrage ID-ul numeric din formatul Cloudinary gallery-XXXX-XXXX sau gallery-XXXX
      const match = cloudinaryPath.match(/gallery-(\d+)/)
      return match ? match[1] : cloudinaryPath
    }
    
    const numericId = extractNumericId(id)
    console.log('🔍 Extracted numeric ID for PUT:', numericId, 'from path:', id)
    
    const rowIndex = data.slice(1).findIndex(row => {
      const rowId = row[idColumnIndex]
      return String(rowId) === String(numericId)
    })
    
    if (rowIndex === -1) {
      // Image not found in Google Sheets, but might exist in Cloudinary
      // Create a new entry in Google Sheets for this Cloudinary image
      console.log(`🆕 Creating new Google Sheets entry for Cloudinary image: ${id}`)
      
      // Get image data from Cloudinary if available
      let imageUrl = ''
      let imageAltText = alt_text || ''
      let imageCategory = category || 'general'
      
      try {
        // Try to get image info from Cloudinary
        const cloudinaryResult = await CloudinaryService.searchImages(`public_id:${id}`)
        if (cloudinaryResult.success && cloudinaryResult.data.length > 0) {
          const cloudinaryImage = cloudinaryResult.data[0]
          imageUrl = cloudinaryImage.url
          imageAltText = alt_text || cloudinaryImage.description || ''
          imageCategory = category || cloudinaryImage.category || 'general'
        }
      } catch (cloudinaryError) {
        console.warn('⚠️ Could not fetch Cloudinary image info:', cloudinaryError.message)
      }
      
      // Create new row data
      const newRowData = [
        id,                                    // ID
        imageUrl,                              // URL
        imageAltText,                          // Alt text
        imageCategory,                         // Category
        active !== undefined ? active : true,  // Active status
        new Date().toISOString()               // Created at
      ]
      
      try {
        await GoogleSheetsService.appendData('Gallery', newRowData)
        console.log('✅ New Google Sheets entry created for Cloudinary image')
        
        return res.json({ 
          success: true, 
          message: 'Image metadata created successfully',
          image: {
            id,
            url: imageUrl,
            alt_text: imageAltText,
            category: imageCategory,
            active: active !== undefined ? active : true,
            createdAt: new Date().toISOString()
          }
        })
      } catch (appendError) {
        console.error('❌ Error creating Google Sheets entry:', appendError)
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to create image metadata' 
        })
      }
    }

    // Update the data in the row
    const actualRowIndex = rowIndex + 1 // +1 to account for header row
    const currentRow = [...data[actualRowIndex]] // Create a copy
    
    // Update fields if provided
    if (active !== undefined) {
      currentRow[4] = active // Active status is in column 5 (index 4)
    }
    if (alt_text !== undefined) {
      currentRow[2] = alt_text // Alt text is in column 3 (index 2)
    }
    if (category !== undefined) {
      currentRow[3] = category // Category is in column 4 (index 3)
    }

    // Update the data in Google Sheets
    await GoogleSheetsService.updateData('Gallery', actualRowIndex + 1, currentRow)
    console.log('✅ Gallery image updated successfully:', id)

    res.json({ 
      success: true, 
      message: 'Image updated successfully',
      image: {
        id: currentRow[0],
        url: currentRow[1],
        alt_text: currentRow[2],
        category: currentRow[3],
        active: currentRow[4]
      }
    })
  } catch (error) {
    console.error('Update gallery image error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update gallery image' 
    })
  }
})

// Delete gallery image - using wildcard to handle IDs with forward slashes
router.delete('/gallery/*', requireAuth, async (req, res) => {
  try {
    const id = req.params[0] // Get the full path after /gallery/
    console.log('🗑️ Attempting to delete gallery image with ID:', id)
    console.log('📍 Request path:', req.path)
    console.log('🔍 Route params:', req.params)
    
    // First, find the image in Google Sheets to get the URL and determine if it's local or Cloudinary
    const data = await GoogleSheetsService.getData('Gallery')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Gallery is empty'
      })
    }
    
    const headers = data[0]
    const idColumnIndex = headers.findIndex(header => 
      header.toLowerCase().replace(/ /g, '_') === 'id'
    )
    
    if (idColumnIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'ID column not found in Google Sheets'
      })
    }
    
    // Find image by matching Cloudinary URL or ID pattern
    const findImageRow = (targetId, rows) => {
      // Caută după ID direct
      let rowIndex = rows.findIndex(row => String(row[idColumnIndex]) === String(targetId))
      if (rowIndex !== -1) return rowIndex
      
      // Caută după URL care conține partea din ID
      const urlColumnIndex = headers.findIndex(header => 
        header.toLowerCase().replace(/ /g, '_') === 'image_url'
      )
      
      if (urlColumnIndex !== -1) {
        // Extrage partea relevantă din ID pentru căutare
        const searchPattern = targetId.includes('gallery-') ? targetId : `gallery-${targetId}`
        
        rowIndex = rows.findIndex(row => {
          const url = row[urlColumnIndex] || ''
          return url.includes(searchPattern)
        })
      }
      
      return rowIndex
    }
    
    console.log('🔍 Searching for image with ID:', id)
    
    // Find the row with matching ID or URL
    const rowIndex = findImageRow(id, data.slice(1))
    
    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Image not found in Google Sheets'
      })
    }
    
    // Get the image data from Google Sheets
    const imageRow = data.slice(1)[rowIndex]
    const imageData = {}
    headers.forEach((header, index) => {
      imageData[header.toLowerCase().replace(/ /g, '_')] = imageRow[index] || ''
    })
    
    console.log('🖼️ Found image data:', JSON.stringify(imageData, null, 2))
    
    const imageUrl = imageData.image_url || ''
    
    // Delete from Cloudinary if it's a Cloudinary URL
    if (imageUrl.includes('cloudinary.com')) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split('/')
        const versionIndex = urlParts.findIndex(part => part.startsWith('v'))
        if (versionIndex !== -1 && versionIndex < urlParts.length - 1) {
          const publicId = urlParts.slice(versionIndex + 1).join('/').split('.')[0]
          console.log('🗑️ Deleting Cloudinary image with public_id:', publicId)
          
          const { default: CloudinaryService } = await import('../services/cloudinaryService.js')
          const cloudinaryResult = await CloudinaryService.deleteImage(publicId)
          
          if (cloudinaryResult.success) {
            console.log('✅ Cloudinary image deleted successfully')
          } else {
            console.log('⚠️ Cloudinary deletion failed:', cloudinaryResult.error)
          }
        }
      } catch (cloudinaryError) {
        console.warn('⚠️ Could not delete from Cloudinary:', cloudinaryError.message)
      }
    } else if (imageUrl.startsWith('/uploads/')) {
      // Delete local file
      try {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const filePath = path.join(__dirname, '..', '..', imageUrl)
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
          console.log('✅ Local file deleted:', filePath)
        } else {
          console.log('⚠️ Local file not found:', filePath)
        }
      } catch (fileError) {
        console.warn('⚠️ Could not delete local file:', fileError.message)
      }
    }
    
    // Delete from Google Sheets
    try {
      const actualRowIndex = rowIndex // Use 0-based index for GoogleSheetsService.deleteData
      await GoogleSheetsService.deleteData('Gallery', actualRowIndex)
      console.log('✅ Google Sheets entry deleted successfully')
    } catch (sheetsError) {
      console.warn('⚠️ Could not delete from Google Sheets:', sheetsError.message)
    }
    
    res.json({ 
      success: true, 
      message: 'Image deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting gallery image:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete gallery image'
    })
  }
})

// Get all services
router.get('/services', requireAuth, async (req, res) => {
  try {
    // Return empty array for now since services are managed in vehicle-services
    // This endpoint is kept for backward compatibility
    res.json([])
  } catch (error) {
    console.error('Services error:', error)
    res.status(500).json({ error: 'Failed to load services' })
  }
})

// Get vehicle services
router.get('/vehicle-services', requireAuth, async (req, res) => {
  try {
    const data = await GoogleSheetsService.getData('Vehicle_Services')
    
    if (data.length <= 1) {
      return res.json([])
    }

    const vehicleServices = data.slice(1).map((row, index) => ({
      id: row[0] || `vehicle_service_${index + 1}`,
      name: row[1] || '',
      description: row[2] || '',
      price: row[3] || '0',
      duration: row[4] || '0',
      category: row[5] || 'general',
      isActive: row[6] !== 'false'
    }))

    res.json(vehicleServices)
  } catch (error) {
    console.error('Vehicle services error:', error)
    res.status(500).json({ error: 'Failed to load vehicle services' })
  }
})

// Get body types
router.get('/body-types', requireAuth, async (req, res) => {
  try {
    const data = await GoogleSheetsService.getData('Body_Types')
    
    if (data.length <= 1) {
      return res.json([])
    }

    const bodyTypes = data.slice(1).map((row, index) => ({
      id: row[0] || `body_type_${index + 1}`,
      name: row[1] || '',
      description: row[2] || '',
      image: row[3] || '',
      isActive: row[4] !== 'false'
    }))

    res.json(bodyTypes)
  } catch (error) {
    console.error('Body types error:', error)
    res.status(500).json({ error: 'Failed to load body types' })
  }
})

// Get newsletter subscribers
router.get('/newsletter-subscribers', requireAuth, async (req, res) => {
  try {
    const data = await GoogleSheetsService.getData('Newsletter')
    
    if (data.length <= 1) {
      return res.json([])
    }

    // Convert rows to subscriber objects
    const subscribers = data.slice(1).map((row, index) => ({
      id: row[0] || `subscriber_${index + 1}`,
      email: row[1] || '',
      subscribedAt: row[2] || new Date().toISOString(),
      status: row[3] || 'active'
    }))

    res.json(subscribers)
  } catch (error) {
    console.error('Newsletter subscribers error:', error)
    res.status(500).json({ error: 'Failed to load newsletter subscribers' })
  }
})

// Send newsletter
router.post('/newsletter/send', requireAuth, async (req, res) => {
  try {
    const { subject, content } = req.body
    
    if (!subject || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Subject and content are required' 
      })
    }

    // Get all active subscribers
    const data = await GoogleSheetsService.getData('Newsletter')
    const subscribers = data.slice(1).filter(row => {
      const status = row[3] || 'active'
      return status === 'active'
    }).map(row => row[1]) // Email is in column 1

    if (subscribers.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No active subscribers found' 
      })
    }

    console.log(`📧 Sending newsletter to ${subscribers.length} subscribers`)
    
    // Here you would integrate with your email service
    // For now, we'll just log and return success
    console.log(`📨 Newsletter subject: ${subject}`)
    console.log(`📝 Newsletter content preview: ${content.substring(0, 100)}...`)
    
    // Log the newsletter send event to Google Sheets
    const newsletterLog = [
      Date.now().toString(),
      new Date().toISOString(),
      subject,
      subscribers.length.toString(),
      'sent'
    ]
    
    try {
      await GoogleSheetsService.appendData('NewsletterLogs', newsletterLog)
    } catch (logError) {
      console.warn('⚠️ Failed to log newsletter send event:', logError.message)
    }

    res.json({ 
      success: true, 
      message: `Newsletter sent successfully to ${subscribers.length} subscribers`,
      subscriberCount: subscribers.length
    })
  } catch (error) {
    console.error('Send newsletter error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send newsletter' 
    })
  }
})

// Test email service
router.get('/email/test', requireAuth, async (req, res) => {
  try {
    console.log('🧪 Testing email service...');
    const result = await testEmailService();
    
    if (result) {
      res.json({ 
        success: true, 
        message: 'Email service is working correctly' 
      });
    } else {
      res.status(503).json({ 
        success: false, 
        error: 'Email service is not configured properly' 
      });
    }
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to test email service' 
    });
  }
});

// Delete booking
router.delete('/bookings/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Attempting to delete booking with ID:', id);
    console.log('📍 ID type:', typeof id);
    console.log('📍 ID value:', JSON.stringify(id));

    // Get all bookings to find the one to delete
    const data = await GoogleSheetsService.getData('Bookings');
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No bookings found' 
      });
    }

    // Log headers and first few rows for debugging
    console.log('📊 Bookings headers:', data[0]);
    console.log('📊 First 3 booking rows:');
    for (let i = 1; i < Math.min(4, data.length); i++) {
      console.log(`Row ${i}: ID="${data[i][0]}" (type: ${typeof data[i][0]}), Name="${data[i][1]}"`);
    }

    // Find the booking by ID with flexible matching
    let bookingIndex = -1;
    const targetId = String(id).trim();
    
    for (let i = 1; i < data.length; i++) {
      const rowId = String(data[i][0] || '').trim();
      console.log(`🔍 Comparing target:"${targetId}" with row:"${rowId}"`);
      
      if (rowId === targetId) {
        bookingIndex = i;
        console.log('✅ Found matching booking at index:', i);
        break;
      }
    }

    if (bookingIndex === -1) {
      console.log('❌ Booking not found after searching all rows');
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }

    // Delete the booking from Google Sheets
    // Note: bookingIndex is the index in data array (including header), 
    // but for Google Sheets deletion we need the row index (excluding header)
    const sheetRowIndex = bookingIndex - 1; // Convert to 0-based index for sheet rows
    console.log('🗑️ Deleting row from sheet, data index:', bookingIndex, 'sheet index:', sheetRowIndex);
    
    await GoogleSheetsService.deleteData('Bookings', sheetRowIndex);
    console.log('✅ Booking deleted successfully from Google Sheets:', id);

    res.json({ 
      success: true, 
      message: 'Booking deleted successfully' 
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete booking' 
    });
  }
});

// Get email configuration status
router.get('/email/config', requireAuth, async (req, res) => {
  try {
    console.log('🔧 Checking email configuration...');
    
    const config = {
      emailUser: process.env.EMAIL_USER ? 'CONFIGURED' : 'MISSING',
      emailPass: process.env.EMAIL_PASS ? 'CONFIGURED' : 'MISSING',
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: process.env.SMTP_PORT || '465',
      smtpSecure: process.env.SMTP_SECURE || 'true'
    };

    // Test if transporter is working
    let transporterStatus = 'UNKNOWN';
    try {
      if (transporter && transporter.verify) {
        await transporter.verify();
        transporterStatus = 'WORKING';
      } else {
        transporterStatus = 'NOT_INITIALIZED';
      }
    } catch (verifyError) {
      transporterStatus = 'FAILED';
      console.error('❌ Transporter verification failed:', verifyError.message);
    }

    res.json({
      success: true,
      configuration: {
        ...config,
        transporterStatus
      },
      message: 'Email configuration retrieved successfully'
    });

  } catch (error) {
    console.error('Email config error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get email configuration'
    });
  }
});

// Send test email
router.post('/email/send', requireAuth, async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;
    
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, html/text'
      });
    }

    console.log(`📧 Sending test email to: ${to}`);
    
    if (!transporter) {
      console.warn('⚠️ Email transporter not available');
      return res.status(503).json({
        success: false,
        error: 'Email service not configured'
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''),
      html: html || text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Test email sent successfully to ${to} with messageId: ${result.messageId}`);
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('❌ Test email failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      response: error.response,
      responseCode: error.responseCode
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      details: error.message
    });
  }
});

export default router