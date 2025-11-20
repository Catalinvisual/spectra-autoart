import { Router } from 'express'
import { getRange, appendRange } from '../services/sheets.js'
import { translateText } from '../services/translator.js'
import VehicleService from '../services/vehicleService.js'
import GoogleSheetsService from '../services/googleSheetsService.js'
import NotificationService from '../services/notificationService.js'

const router = Router()

router.get('/vehicles', async (req, res) => {
  try {
    // Return demo vehicle data that matches client expectations
    const demoVehicles = [
      {
        id: '1',
        make: 'BMW',
        model: 'Seria 3',
        type: 'Sedan',
        body: 'Sedan'
      },
      {
        id: '2',
        make: 'BMW',
        model: 'Seria 5',
        type: 'Sedan',
        body: 'Sedan'
      },
      {
        id: '3',
        make: 'Audi',
        model: 'A4',
        type: 'Sedan',
        body: 'Sedan'
      },
      {
        id: '4',
        make: 'Audi',
        model: 'A6',
        type: 'Sedan',
        body: 'Sedan'
      },
      {
        id: '5',
        make: 'Mercedes',
        model: 'C-Class',
        type: 'Sedan',
        body: 'Sedan'
      }
    ];
    
    res.json({
      success: true,
      data: demoVehicles
    });
  } catch (error) {
    console.error('Error getting vehicles:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get vehicles',
      demo: true 
    });
  }
})

router.get('/vehicles/makes/:make/models', async (req, res) => {
  try {
    const { make } = req.params;
    const models = await VehicleService.getModelsByMake(make);
    
    res.json({
      success: true,
      data: models
    });
  } catch (error) {
    console.error('Error getting vehicle models:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get vehicle models',
      demo: true 
    });
  }
})

router.get('/services', async (req, res) => {
  try {
    // Return demo data for services
    const demoServices = [
      {
        id: 'service-1',
        name: 'Premium Detailing',
        description: 'Complete exterior and interior detailing service',
        price: 150,
        duration: '3-4 hours',
        category: 'detailing'
      },
      {
        id: 'service-2',
        name: 'Interior Cleaning',
        description: 'Deep interior cleaning and protection',
        price: 80,
        duration: '2 hours',
        category: 'interior'
      },
      {
        id: 'service-3',
        name: 'Exterior Wash',
        description: 'Professional exterior washing and waxing',
        price: 45,
        duration: '1 hour',
        category: 'exterior'
      },
      {
        id: 'service-4',
        name: 'Engine Cleaning',
        description: 'Engine bay cleaning and degreasing',
        price: 120,
        duration: '2-3 hours',
        category: 'engine'
      }
    ]
    
    res.json({
      success: true,
      data: demoServices
    })
  } catch (error) {
    console.error('Error getting services:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get services',
      demo: true 
    })
  }
})

router.get('/bookings/availability', async (req, res) => {
  try {
    const { date } = req.query;
    
    // Return demo availability data
    if (date) {
      // For demo purposes, consider all dates available except weekends
      const checkDate = new Date(date);
      const isWeekend = checkDate.getDay() === 0 || checkDate.getDay() === 6;
      
      res.json({ 
        success: true,
        available: !isWeekend,
        date: date
      });
    } else {
      // Return empty booked dates for demo
      res.json({ 
        success: true,
        bookedDates: [],
        available: true
      });
    }
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check availability',
      demo: true 
    });
  }
})

router.post('/bookings', async (req, res) => {
  try {
    const { date, make, model, type, body, services, user, locale } = req.body
    
    if (!date || !make || !model || !user?.name || !user?.email || !user?.phone) {
      return res.status(400).json({ 
        success: false,
        error: 'Toate câmpurile sunt obligatorii' 
      })
    }
    
    // For demo purposes, allow all dates (remove weekend restriction)
    // const bookingDate = new Date(date);
    // const isWeekend = bookingDate.getDay() === 0 || bookingDate.getDay() === 6;
    
    // if (isWeekend) {
    //   return res.status(409).json({ 
    //     success: false,
    //     error: 'Data este deja rezervată' 
    //   })
    // }
    
    const bookingId = Date.now().toString()
    const total = calculateTotal(services)
    
    // Save booking to Google Sheets
    try {
      const servicesList = Array.isArray(services) ? services.join(', ') : services;
      // Since the frontend only provides date, we'll set a default time (09:00)
      // or extract time if it's included in the date string
      let bookingDate, bookingTime;
      
      if (date.includes('T')) {
        // If date includes time (ISO format)
        const dateTime = new Date(date);
        bookingDate = dateTime.toISOString().split('T')[0]; // YYYY-MM-DD
        bookingTime = dateTime.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
      } else {
        // If only date is provided, use default time 09:00
        bookingDate = date; // Already in YYYY-MM-DD format from date input
        bookingTime = '09:00'; // Default time
      }
      
      const bookingData = [
        bookingId,                    // ID
        bookingDate,                  // Date
        bookingTime,                  // Time
        user.name,                    // Customer_Name
        user.email,                   // Email
        user.phone,                   // Phone
        make,                         // Make
        model,                        // Model
        type,                         // Type
        body,                         // Body
        servicesList,                 // Services
        total.toString(),             // Total
        'confirmed',                  // Status
        '',                           // Notes (empty for now)
        new Date().toISOString(),     // Created_Date
        new Date().toISOString()      // Updated_Date
      ];
      
      console.log('💾 Saving booking to Google Sheets:', bookingData);
      const saved = await GoogleSheetsService.appendData('Bookings', bookingData);
      
      if (saved) {
        console.log('✅ Booking saved successfully to Google Sheets');
      } else {
        console.log('⚠️  Booking save failed, continuing with demo mode');
      }
    } catch (sheetsError) {
      console.error('❌ Google Sheets error:', sheetsError);
      // Continue even if Google Sheets fails
    }
    
    // Send notifications (demo mode)
    try {
      console.log('📧 Demo notification would be sent for booking:', bookingId);
      console.log('Booking details:', { user, date, make, model, services, total });
    } catch (notificationError) {
      console.error('❌ Notification error:', notificationError);
    }
    
    res.status(201).json({ 
      success: true, 
      bookingId,
      message: 'Programarea a fost confirmată'
    })
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create booking',
      demo: true 
    })
  }
})

router.post('/newsletter/subscribe', async (req, res) => {
  try {
    const { email, locale } = req.body
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Email invalid' 
      })
    }
    
    // Get client IP
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    
    // Save to Google Sheets
    console.log('💾 Saving newsletter subscription to Google Sheets:', email);
    const saved = await GoogleSheetsService.addNewsletterSubscriber(email, '', locale || 'nl', ip);
    
    if (saved) {
      console.log('✅ Newsletter subscription saved successfully to Google Sheets');
    } else {
      throw new Error('Failed to save newsletter subscription');
    }
    
    res.json({ 
      success: true,
      message: 'Vă mulțumim pentru abonare!'
    })
  } catch (error) {
    console.error('❌ Error subscribing to newsletter:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to subscribe to newsletter'
    })
  }
})

function getLocalizedValue(row, field, locale) {
  const fieldMap = {
    make: { start: 1, count: 5 },
    model: { start: 6, count: 5 },
    type: { start: 11, count: 5 },
    body: { start: 16, count: 5 },
    name: { start: 1, count: 5 },
    desc: { start: 6, count: 5 }
  }
  
  const localeIndex = { nl: 0, en: 1, es: 2, pl: 3, ro: 4 }[locale] || 0
  const fieldConfig = fieldMap[field]
  
  if (!fieldConfig) return row[0] || ''
  
  return row[fieldConfig.start + localeIndex] || row[fieldConfig.start] || ''
}

function calculateTotal(services) {
  return services.reduce((total, service) => {
    return total + (parseFloat(service.price) || 0)
  }, 0)
}

function generateConfirmationEmail(name, date, make, model, services, total, locale) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00e5ff;">Spectra AutoArt - Confirmare Programare</h2>
      <p>Dragă ${name},</p>
      <p>Programarea ta a fost confirmată pentru data de <strong>${date}</strong>.</p>
      <h3>Detalii:</h3>
      <ul>
        <li>Mașină: ${make} ${model}</li>
        <li>Servicii: ${services.map(s => s.name).join(', ')}</li>
        <li>Total: €${total}</li>
      </ul>
      <p>Te așteptăm cu drag!</p>
      <p>Echipa Spectra AutoArt</p>
    </div>
  `
}

export default router