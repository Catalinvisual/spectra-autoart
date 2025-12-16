import { Router } from 'express'
import auth from '../middleware/auth.js'
import GoogleSheetsService from '../services/googleSheetsService.js'
import emailService from '../services/emailService.js'

// Cache for booking enrichment data (same as admin panel)
let bookingsEnrichmentCache = {
  services: [],
  lastUpdated: 0
}

// Function to ensure cache is populated (same as admin panel)
const ensureEnrichmentCache = async () => {
  const now = Date.now()
  if (now - bookingsEnrichmentCache.lastUpdated > 300000) { // 5 minutes
    try {
      console.log('🔄 Refreshing bookings enrichment cache...')
      const servicesData = await GoogleSheetsService.getData('Services')
      
      if (servicesData && servicesData.length > 1) {
        const headers = servicesData[0]
        const nameIndex = headers.indexOf('Service Name')
        const bodyTypeIndex = headers.indexOf('Body Type')
        const priceIndex = headers.indexOf('Price')
        
        const servicesMap = new Map()
        
        servicesData.slice(1).forEach(row => {
          const serviceName = row[nameIndex]
          const bodyType = row[bodyTypeIndex]?.toLowerCase().replace(/\s+/g, '')
          const price = parseFloat(row[priceIndex]) || 0
          
          if (!servicesMap.has(serviceName)) {
            servicesMap.set(serviceName, {
              name: serviceName,
              prices: {},
              minPrice: Infinity
            })
          }
          
          const service = servicesMap.get(serviceName)
          if (bodyType) {
            service.prices[bodyType] = price
          }
          service.minPrice = Math.min(service.minPrice, price)
        })
        
        bookingsEnrichmentCache.services = Array.from(servicesMap.values())
        bookingsEnrichmentCache.lastUpdated = now
        console.log(`✅ Cache refreshed with ${bookingsEnrichmentCache.services.length} services`)
      }
    } catch (error) {
      console.error('❌ Failed to refresh enrichment cache:', error)
    }
  }
}

const router = Router()

// Get specific booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    
    // CRITICAL: Force refresh cache to ensure we get latest data
    console.log(`🔄 Force refreshing cache before getting booking ${id}`)
    GoogleSheetsService.clearCache('Bookings')
    
    // Get real bookings data from Google Sheets
    const data = await GoogleSheetsService.getData('Bookings')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      })
    }

    const headers = data[0]
    const bookingRow = data.slice(1).find(row => row[headers.indexOf('ID')] === id)
    
    if (!bookingRow) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      })
    }

    const booking = {}
    headers.forEach((header, colIndex) => {
      booking[header.toLowerCase().replace(/\s+/g, '_')] = bookingRow[colIndex] || ''
    })

    // Convert to frontend format
    const formattedBooking = {
      id: booking.id,
      date: booking.date || '',
      time: booking.time || '',
      customer_name: booking.name || '',
      customer_email: booking.email || '',
      customer_phone: booking.phone || '',
      make: booking.make || '',
      model: booking.model || '',
      type: booking.type || '',
      body: booking.body || '',
      services: parseServices(booking.services || ''),
      total: booking.total || '0',
      status: booking.status || 'pending',
      notes: '',
      created_date: booking.created_at || new Date().toISOString(),
      updated_date: new Date().toISOString()
    }

    res.json({ 
      success: true, 
      data: formattedBooking 
    })
  } catch (error) {
    console.error('Error getting booking:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get booking' 
    })
  }
})

// Get all bookings
router.get('/', auth, async (req, res) => {
  try {
    // CRITICAL: Force refresh cache to ensure we get latest data
    console.log(`🔄 Force refreshing cache before getting all bookings`)
    GoogleSheetsService.clearCache('Bookings')
    
    // Get real bookings data from Google Sheets
    const data = await GoogleSheetsService.getData('Bookings')
    
    if (data.length <= 1) {
      return res.json({ 
        success: true, 
        data: [] 
      })
    }

    const headers = data[0]
    const bookings = data.slice(1).map((row, index) => {
      const booking = {}
      headers.forEach((header, colIndex) => {
        booking[header.toLowerCase().replace(/\s+/g, '_')] = row[colIndex] || ''
      })
      
      // Convert to frontend format
      return {
        id: booking.id || `booking-${index + 1}`,
        date: booking.date || '',
        time: booking.time || '',
        customer_name: booking.name || '',
        customer_email: booking.email || '',
        customer_phone: booking.phone || '',
        make: booking.make || '',
        model: booking.model || '',
        type: booking.type || '',
        body: booking.body || '',
        services: parseServices(booking.services || ''),
        total: booking.total || '0',
        status: booking.status || 'pending',
        notes: '',
        created_date: booking.created_at || new Date().toISOString(),
        updated_date: new Date().toISOString()
      }
    })

    res.json({ 
      success: true, 
      data: bookings 
    })
  } catch (error) {
    console.error('Error getting bookings:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get bookings' 
    })
  }
})

// Helper function to parse services string
function parseServices(servicesString) {
  if (!servicesString) return []
  
  try {
    // Try to parse as JSON first
    return JSON.parse(servicesString)
  } catch (e) {
    // If not JSON, try to parse as comma-separated list
    return servicesString.split(',').map(service => ({
      name: service.trim(),
      price: 0
    }))
  }
}

// Update booking status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status || !['confirmed', 'cancelled', 'completed', 'pending'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid status. Must be: confirmed, cancelled, completed, or pending' 
      })
    }

    console.log('📋 Booking status update:', id, '->', status);

    // Ensure enrichment cache is populated
    await ensureEnrichmentCache();

    // Get current booking data from Google Sheets
    const data = await GoogleSheetsService.getData('Bookings')
    if (!data || data.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'No bookings found' 
      })
    }

    const headers = data[0]
    const idIndex = headers.indexOf('ID')
    const nameIndex = headers.indexOf('Customer Name')
    const emailIndex = headers.indexOf('Email')
    const phoneIndex = headers.indexOf('Phone')
    const dateIndex = headers.indexOf('Date')
    const timeIndex = headers.indexOf('Time')
    const makeIndex = headers.indexOf('Make')
    const modelIndex = headers.indexOf('Model')
    const bodyIndex = headers.indexOf('Body')
    const servicesIndex = headers.indexOf('Services')
    const totalIndex = headers.indexOf('Total')
    const statusIndex = headers.indexOf('Status')
    const localeIndex = headers.indexOf('Locale')

    // Find the booking row
    const rowIndex = data.slice(1).findIndex(row => row[idIndex] === id)
    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      })
    }

    const actualRowIndex = rowIndex + 1
    const currentRow = data[actualRowIndex]

    // Parse services from the stored JSON string
    let services = []
    try {
      services = JSON.parse(currentRow[servicesIndex] || '[]')
    } catch (e) {
      console.warn('Failed to parse services JSON, using raw services string')
      services = currentRow[servicesIndex] ? currentRow[servicesIndex].split(',').map(s => ({ name: s.trim(), price: 0 })) : []
    }

    // Create booking data object for emails
    const bookingData = {
      id: currentRow[idIndex],
      customer_name: currentRow[nameIndex],
      user: {
        email: currentRow[emailIndex],
        phone: currentRow[phoneIndex]
      },
      date: currentRow[dateIndex],
      time: currentRow[timeIndex],
      make: currentRow[makeIndex],
      model: currentRow[modelIndex],
      body: currentRow[bodyIndex],
      services: services,
      total: currentRow[totalIndex],
      status: status,
      locale: currentRow[localeIndex] || 'nl'
    }

    // Update status in Google Sheets
    data[actualRowIndex][statusIndex] = status
    await GoogleSheetsService.updateData('Bookings', actualRowIndex, data[actualRowIndex])

    // Force cache refresh
    console.log(`🔄 Force refreshing cache after booking status update`)
    GoogleSheetsService.clearCache('Bookings')
    await GoogleSheetsService.getData('Bookings')

    // Send emails based on status change
    if (status === 'cancelled') {
      console.log('📧 Sending cancellation emails...')
      
      // Parse services - could be a string (ID) or array
      let servicesList = []
      if (typeof services === 'string') {
        // Single service ID, find it in cache
        const serviceId = services
        const cacheService = bookingsEnrichmentCache.services.find(s => s.id == serviceId)
        if (cacheService) {
          // Use body-specific price if available, otherwise minimum price
          const bodyKey = bookingData.body?.toLowerCase().replace(/\s+/g, '')
          const bodyPrice = cacheService.prices[bodyKey]
          const price = bodyPrice || cacheService.minPrice || 0
          
          servicesList = [{
            name: cacheService.name,
            price: price
          }]
        } else {
          servicesList = [{
            name: 'Service',
            price: 0
          }]
        }
      } else if (Array.isArray(services)) {
        // Array of services - use the original logic
        servicesList = services.map(service => {
          // Try to find service in cache with exact name match first
          const cacheService = bookingsEnrichmentCache.services.find(s => 
            s.name.toLowerCase() === service.name.toLowerCase()
          )
          
          if (cacheService) {
            // Use body-specific price if available, otherwise minimum price
            const bodyKey = bookingData.body?.toLowerCase().replace(/\s+/g, '')
            const bodyPrice = cacheService.prices[bodyKey]
            const price = bodyPrice || cacheService.minPrice || 0
            
            return {
              name: cacheService.name,
              price: price
            }
          }
          
          return {
            name: service.name,
            price: service.price || 0
          }
        })
      }
      
      console.log('📋 Calculated services for email:', servicesList)

      // Send client cancellation email
      try {
        const clientHtml = emailService.emailTemplates.clientCancellation(bookingData, servicesList)
        await emailService.sendEmail(
          bookingData.user.email,
          `Programare Anulată - Spectra AutoArt`,
          clientHtml
        )
        console.log('✅ Client cancellation email sent successfully')
      } catch (emailError) {
        console.error('❌ Failed to send client cancellation email:', emailError)
      }

      // Send admin cancellation notification
      try {
        const adminHtml = emailService.emailTemplates.adminCancellation(bookingData, servicesList)
        await emailService.sendEmail(
          'contact@spectraautoart.nl',
          `Programare Anulată - ${bookingData.customer_name}`,
          adminHtml
        )
        console.log('✅ Admin cancellation notification sent successfully')
      } catch (emailError) {
        console.error('❌ Failed to send admin cancellation notification:', emailError)
      }
    }

    res.json({ 
      success: true, 
      message: 'Booking status updated successfully',
      data: { id, status, bookingData }
    })
  } catch (error) {
    console.error('Error updating booking status:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update booking status'
    })
  }
})

// Update booking (full update with Google Sheets sync)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { date, time, customer_name, customer_email, customer_phone, make, model, type, body, services, total, status } = req.body

    console.log(`📝 Full booking update request for ID: ${id}`)
    console.log(`📅 Update data:`, { date, time, customer_name, customer_email, customer_phone, make, model, type, body, services, total, status })

    // Get current data from Google Sheets
    const data = await GoogleSheetsService.getData('Bookings')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No bookings found' 
      })
    }

    const headers = data[0]
    const idIndex = headers.indexOf('ID')
    const nameIndex = headers.indexOf('Name')
    const emailIndex = headers.indexOf('Email')
    const phoneIndex = headers.indexOf('Phone')
    const dateIndex = headers.indexOf('Date')
    const timeIndex = headers.indexOf('Time')
    const makeIndex = headers.indexOf('Make')
    const modelIndex = headers.indexOf('Model')
    const typeIndex = headers.indexOf('Type')
    const bodyIndex = headers.indexOf('Body')
    const servicesIndex = headers.indexOf('Services')
    const totalIndex = headers.indexOf('Total')
    const statusIndex = headers.indexOf('Status')

    // Find the booking row
    const rowIndex = data.slice(1).findIndex(row => row[idIndex] === id)
    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      })
    }

    const actualRowIndex = rowIndex + 1

    // Update the row data
    if (customer_name !== undefined) data[actualRowIndex][nameIndex] = customer_name
    if (customer_email !== undefined) data[actualRowIndex][emailIndex] = customer_email
    if (customer_phone !== undefined) data[actualRowIndex][phoneIndex] = customer_phone
    if (date !== undefined) data[actualRowIndex][dateIndex] = date
    if (time !== undefined) data[actualRowIndex][timeIndex] = time
    if (make !== undefined) data[actualRowIndex][makeIndex] = make
    if (model !== undefined) data[actualRowIndex][modelIndex] = model
    if (type !== undefined) data[actualRowIndex][typeIndex] = type
    if (body !== undefined) data[actualRowIndex][bodyIndex] = body
    if (services !== undefined) data[actualRowIndex][servicesIndex] = JSON.stringify(services)
    if (total !== undefined) data[actualRowIndex][totalIndex] = total
    if (status !== undefined) data[actualRowIndex][statusIndex] = status

    // Update in Google Sheets
    await GoogleSheetsService.updateData('Bookings', actualRowIndex, data[actualRowIndex])

    // CRITICAL: Force cache refresh to ensure data persistence
    console.log(`🔄 Force refreshing cache after booking update`)
    GoogleSheetsService.clearCache('Bookings')
    await GoogleSheetsService.getData('Bookings')

    res.json({ 
      success: true, 
      message: 'Booking updated successfully',
      data: { id, ...req.body }
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update booking',
      details: error.message
    })
  }
})

// Delete booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params

    // Demo mode - simulate booking deletion
    console.log('🗑️  Demo booking deletion:', id);

    res.json({ 
      success: true, 
      message: 'Booking deleted successfully (demo mode)' 
    })
  } catch (error) {
    console.error('Error deleting booking:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete booking',
      demo: true 
    })
  }
})

export default router