import { Router } from 'express'
import auth from '../middleware/auth.js'
import GoogleSheetsService from '../services/googleSheetsService.js'

const router = Router()

// Get specific booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    
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

    // Demo mode - simulate status update
    console.log('📋 Demo booking status update:', id, '->', status);

    res.json({ 
      success: true, 
      message: 'Booking status updated successfully (demo mode)' 
    })
  } catch (error) {
    console.error('Error updating booking status:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update booking status',
      demo: true 
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