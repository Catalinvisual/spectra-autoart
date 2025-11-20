import { Router } from 'express'
import auth from '../middleware/auth.js'
import GoogleSheetsService from '../services/googleSheetsService.js'

const router = Router()

// Get all bookings
router.get('/', auth, async (req, res) => {
  try {
    // Return demo bookings data
    const demoBookings = [
      {
        id: 'booking-1',
        date: '2024-01-15',
        time: '09:00',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        customer_phone: '+1234567890',
        make: 'BMW',
        model: 'Seria 3',
        type: 'Sedan',
        body: 'Sedan',
        services: [
          { name: 'Premium Detailing', price: 150 },
          { name: 'Interior Cleaning', price: 80 }
        ],
        total: '230',
        status: 'confirmed',
        notes: '',
        created_date: '2024-01-01T10:00:00.000Z',
        updated_date: '2024-01-01T10:00:00.000Z'
      },
      {
        id: 'booking-2',
        date: '2024-01-16',
        time: '14:00',
        customer_name: 'Jane Smith',
        customer_email: 'jane@example.com',
        customer_phone: '+0987654321',
        make: 'Audi',
        model: 'A4',
        type: 'Sedan',
        body: 'Sedan',
        services: [
          { name: 'Exterior Wash', price: 45 }
        ],
        total: '45',
        status: 'pending',
        notes: '',
        created_date: '2024-01-02T11:00:00.000Z',
        updated_date: '2024-01-02T11:00:00.000Z'
      }
    ]

    res.json({ 
      success: true, 
      data: demoBookings 
    })
  } catch (error) {
    console.error('Error getting bookings:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get bookings',
      demo: true 
    })
  }
})

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