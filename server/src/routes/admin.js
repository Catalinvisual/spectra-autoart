// Admin routes
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import GoogleSheetsService from '../services/googleSheetsService.js'
import requireAuth from '../middleware/auth.js'

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
      const date = row[1] || ''
      const time = row[2] || ''
      const name = row[3] || ''
      const email = row[4] || ''
      const phone = row[5] || ''
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
    const data = await GoogleSheetsService.getData('Gallery')
    
    if (data.length <= 1) {
      return res.json([])
    }

    // Convert rows to gallery objects
    const gallery = data.slice(1).map((row, index) => ({
      id: row[0] || `gallery_${index + 1}`,
      url: row[1] || '', // image URL (column B)
      alt_text: row[2] || '', // description (column C)
      category: row[3] || 'general', // category (column D)
      active: row[4] === true || row[4] === 'true', // active (column E)
      createdAt: row[5] || new Date().toISOString() // upload date (column F)
    }))

    res.json(gallery)
  } catch (error) {
    console.error('Gallery error:', error)
    res.status(500).json({ error: 'Failed to load gallery' })
  }
})

// Add new gallery image
router.post('/gallery', requireAuth, async (req, res) => {
  try {
    const { url, alt_text, category, active } = req.body
    
    // Validate required fields
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image URL is required' 
      })
    }

    // Generate unique ID
    const id = Date.now().toString()
    const createdAt = new Date().toISOString()

    // Create new gallery entry - match Google Sheets structure
    const galleryData = [
      id,                                    // ID (column A)
      url,                                   // Title (column B) - contains image URL
      alt_text || '',                        // Description (column C)
      category || 'general',                 // Image_URL (column D) - contains category
      active !== undefined ? active : true,  // Category (column E) - contains active status
      createdAt                              // Active (column F) - contains upload date
    ]

    console.log('🖼️ Adding gallery image:', galleryData)

    // Append to Google Sheets
    await GoogleSheetsService.appendData('Gallery', galleryData)

    res.json({ 
      success: true, 
      message: 'Gallery image added successfully',
      image: {
        id,
        url,
        alt_text: alt_text || '',
        category,
        active: active !== undefined ? active : true,
        createdAt
      }
    })
  } catch (error) {
    console.error('Add gallery error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add gallery image' 
    })
  }
})

// Delete gallery image
router.delete('/gallery/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    console.log('🗑️ Attempting to delete gallery image with ID:', id)
    
    const data = await GoogleSheetsService.getData('Gallery')
    console.log('📊 Gallery data for deletion:', JSON.stringify(data, null, 2))
    
    if (data.length <= 1) {
      console.log('❌ No gallery data found for deletion')
      return res.status(404).json({ 
        success: false, 
        error: 'No gallery images found' 
      })
    }

    // Get headers to find the correct column for ID
    const headers = data[0]
    console.log('📋 Gallery headers:', headers)
    
    // Find the ID column index (usually 'id' or similar)
    const idColumnIndex = headers.findIndex(header => 
      header.toLowerCase().replace(/ /g, '_') === 'id'
    )
    
    console.log('🔍 ID column index:', idColumnIndex)
    
    if (idColumnIndex === -1) {
      console.log('❌ ID column not found in headers')
      return res.status(404).json({ 
        success: false, 
        error: 'ID column not found in gallery data' 
      })
    }

    const rowIndex = data.slice(1).findIndex(row => {
      const rowId = row[idColumnIndex]
      console.log('🔍 Comparing row ID:', rowId, 'with ID:', id, 'Types:', typeof rowId, typeof id)
      // Handle both string and number comparisons
      return String(rowId) === String(id)
    })
    
    console.log('📍 Row index found:', rowIndex)
    
    if (rowIndex === -1) {
      console.log('❌ Gallery image not found with ID:', id)
      return res.status(404).json({ 
        success: false, 
        error: 'Gallery image not found' 
      })
    }

    console.log('🗑️ Deleting row at index:', rowIndex)
    // Convert to 0-based index for GoogleSheetsService (data rows start at index 0)
    const actualRowIndex = rowIndex
    console.log('🗑️ Actual row index for deletion:', actualRowIndex)
    const success = await GoogleSheetsService.deleteData('Gallery', actualRowIndex)
    console.log('✅ Deletion result:', success)
    
    res.json({ 
      success: true, 
      message: 'Gallery image deleted successfully' 
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
    const data = await GoogleSheetsService.getData('VehicleServices')
    
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
    const data = await GoogleSheetsService.getData('BodyTypes')
    
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

export default router