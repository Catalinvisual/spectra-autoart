import { Router } from 'express'
import { getRange, appendRange } from '../services/sheets.js'
import { translateText } from '../services/translator.js'
import VehicleService from '../services/vehicleService.js'
import GoogleSheetsService from '../services/googleSheetsService.js'
import NotificationService from '../services/notificationService.js'
import { translateMultipleWithCache } from '../services/translationCacheService.js'

const router = Router()

router.get('/vehicles', async (req, res) => {
  try {
    const { lang = 'nl' } = req.query
    // Try to fetch vehicles from Google Sheets first
    let vehicles = []
    
    try {
      const data = await GoogleSheetsService.getData('Vehicles')
      console.log(`📊 Raw vehicles data from Google Sheets:`, data.length, 'rows')
      
      if (data.length > 1) { // Has headers and data
        const headers = data[0]
        console.log(`📋 Headers found:`, headers)
        
        // Use multilingual columns based on the requested language
        const langSuffix = lang.toUpperCase()
        const idIndex = headers.indexOf('ID')
        const makeIndex = headers.indexOf(`Make_${langSuffix}`)
        const modelIndex = headers.indexOf(`Model_${langSuffix}`)
        const typeIndex = headers.indexOf(`Type_${langSuffix}`)
        const bodyIndex = headers.indexOf(`Body_${langSuffix}`)
        
        console.log(`🔍 Column indices - ID:${idIndex}, Make_${langSuffix}:${makeIndex}, Model_${langSuffix}:${modelIndex}, Type_${langSuffix}:${typeIndex}, Body_${langSuffix}:${bodyIndex}`)
        
        if (idIndex === -1 || makeIndex === -1 || modelIndex === -1 || typeIndex === -1 || bodyIndex === -1) {
          console.log('❌ Missing required multilingual columns, trying fallback to NL columns')
          // Fallback to Dutch (NL) if requested language columns don't exist
          const nlMakeIndex = headers.indexOf('Make_NL')
          const nlModelIndex = headers.indexOf('Model_NL')
          const nlTypeIndex = headers.indexOf('Type_NL')
          const nlBodyIndex = headers.indexOf('Body_NL')
          
          if (nlMakeIndex === -1 || nlModelIndex === -1 || nlTypeIndex === -1 || nlBodyIndex === -1) {
            console.log('❌ Missing required NL columns, throwing error')
            throw new Error('Missing required columns in Google Sheets')
          }
          
          // Use NL columns and translate if needed
          vehicles = data.slice(1).map(row => ({
            id: row[idIndex] || '',
            make: row[nlMakeIndex] || '',
            model: row[nlModelIndex] || '',
            type: row[nlTypeIndex] || '',
            body: row[nlBodyIndex] || ''
          })).filter(vehicle => vehicle.make && vehicle.model) // Filter out empty rows
          
          // Translate to requested language if not NL
          if (lang !== 'nl') {
            try {
              const makesToTranslate = vehicles.map(vehicle => vehicle.make)
              const modelsToTranslate = vehicles.map(vehicle => vehicle.model)
              const typesToTranslate = vehicles.map(vehicle => vehicle.type)
              const bodiesToTranslate = vehicles.map(vehicle => vehicle.body)
              
              const [translatedMakes, translatedModels, translatedTypes, translatedBodies] = await Promise.all([
                translateMultipleWithCache(makesToTranslate, lang),
                translateMultipleWithCache(modelsToTranslate, lang),
                translateMultipleWithCache(typesToTranslate, lang),
                translateMultipleWithCache(bodiesToTranslate, lang)
              ])
              
              vehicles = vehicles.map((vehicle, index) => ({
                ...vehicle,
                make: translatedMakes[index] || vehicle.make,
                model: translatedModels[index] || vehicle.model,
                type: translatedTypes[index] || vehicle.type,
                body: translatedBodies[index] || vehicle.body
              }))
              
              console.log(`🔄 Translated ${vehicles.length} vehicles from NL to ${lang}`)
            } catch (translationError) {
              console.error('Translation error:', translationError)
              // Keep original vehicles data if translation fails
            }
          }
        } else {
          // Use requested language columns directly
          vehicles = data.slice(1).map(row => ({
            id: row[idIndex] || '',
            make: row[makeIndex] || '',
            model: row[modelIndex] || '',
            type: row[typeIndex] || '',
            body: row[bodyIndex] || ''
          })).filter(vehicle => vehicle.make && vehicle.model) // Filter out empty rows
        }
        
        console.log(`✅ Parsed ${vehicles.length} vehicles from Google Sheets`)
        console.log(`📋 First 3 vehicles:`, vehicles.slice(0, 3))
      } else {
        console.log('⚠️  No vehicles data in Google Sheets, trying Vehicles API')
        throw new Error('No vehicles data in Google Sheets')
      }
    } catch (sheetsError) {
      console.warn('⚠️  Google Sheets failed, trying Vehicles API:', sheetsError.message)
      
      // Return error with demo data as fallback
      console.error('❌ Both Google Sheets and Vehicles API failed, returning error')
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get vehicles from data sources',
        demo: false 
      })
      return
    }
    
    return res.json({ 
      success: true, 
      data: vehicles 
    })
  } catch (error) {
    console.error('Error getting vehicles:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get vehicles'
    })
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
    const { lang = 'nl' } = req.query
    let services = []
    
    // Try to fetch services from Google Sheets first
    try {
      const servicesData = await GoogleSheetsService.getData('Services')
      console.log(`📊 Raw services data from Google Sheets:`, servicesData.length, 'rows')
      
      if (servicesData.length > 1) { // Has headers and data
        const headers = servicesData[0]
        console.log(`📋 Services headers found:`, headers)
        
        // Use multilingual columns based on the requested language
        const langSuffix = lang.toUpperCase()
        const idIndex = headers.indexOf('ID')
        const nameIndex = headers.indexOf(`Name_${langSuffix}`)
        const descIndex = headers.indexOf(`Description_${langSuffix}`)
        const priceIndex = headers.indexOf('Price')
        const categoryIndex = headers.indexOf('Category')
        const durationIndex = headers.indexOf('Duration_Minutes')
        const isActiveIndex = headers.indexOf('Is_Active')
        
        console.log(`🔍 Services column indices - ID:${idIndex}, Name_${langSuffix}:${nameIndex}, Description_${langSuffix}:${descIndex}`)
        
        if (idIndex === -1 || nameIndex === -1 || descIndex === -1) {
          console.log('❌ Missing required multilingual columns, trying fallback to NL columns')
          // Fallback to Dutch (NL) if requested language columns don't exist
          const nlNameIndex = headers.indexOf('Name_NL')
          const nlDescIndex = headers.indexOf('Description_NL')
          
          if (nlNameIndex === -1 || nlDescIndex === -1) {
            console.log('❌ Missing required NL columns, throwing error')
            throw new Error('Missing required columns in Google Sheets Services')
          }
          
          // Use NL columns and translate if needed
          services = servicesData.slice(1)
            .filter(row => row[isActiveIndex] === 'true') // Only active services
            .map(row => ({
              id: row[idIndex] || '',
              name: row[nlNameIndex] || '',
              description: row[nlDescIndex] || '',
              price: parseFloat(row[priceIndex]) || 0,
              duration: row[durationIndex] ? `${row[durationIndex]} minutes` : '',
              category: row[categoryIndex] || 'general'
            }))
            .filter(service => service.name && service.description) // Filter out empty services
          
          // Translate to requested language if not NL
          if (lang !== 'nl') {
            try {
              const namesToTranslate = services.map(service => service.name)
              const descsToTranslate = services.map(service => service.description)
              
              const [translatedNames, translatedDescs] = await Promise.all([
                translateMultipleWithCache(namesToTranslate, lang),
                translateMultipleWithCache(descsToTranslate, lang)
              ])
              
              services = services.map((service, index) => ({
                ...service,
                name: translatedNames[index] || service.name,
                description: translatedDescs[index] || service.description
              }))
              
              console.log(`🔄 Translated ${services.length} services from NL to ${lang}`)
            } catch (translationError) {
              console.error('Services translation error:', translationError)
              // Keep original services data if translation fails
            }
          }
        } else {
          // Use requested language columns directly
          services = servicesData.slice(1)
            .filter(row => row[isActiveIndex] === 'true') // Only active services
            .map(row => ({
              id: row[idIndex] || '',
              name: row[nameIndex] || '',
              description: row[descIndex] || '',
              price: parseFloat(row[priceIndex]) || 0,
              duration: row[durationIndex] ? `${row[durationIndex]} minutes` : '',
              category: row[categoryIndex] || 'general'
            }))
            .filter(service => service.name && service.description) // Filter out empty services
        }
        
        console.log(`✅ Parsed ${services.length} services from Google Sheets`)
        console.log(`📋 First 3 services:`, services.slice(0, 3))
      } else {
        console.log('⚠️  No services data in Google Sheets')
        throw new Error('No services data in Google Sheets')
      }
    } catch (sheetsError) {
      console.warn('⚠️  Google Sheets services failed:', sheetsError.message)
      
      // Return error with demo data as fallback
      console.error('❌ Failed to get services from Google Sheets, returning error')
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get services from data sources',
        demo: false 
      })
      return
    }
    
    return res.json({ 
      success: true, 
      data: services 
    })
  } catch (error) {
    console.error('Error getting services:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get services'
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