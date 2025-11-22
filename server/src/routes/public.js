import { Router } from 'express'
import { getRange, appendRange } from '../services/sheets.js'
import { translateText } from '../services/translator.js'
import VehicleService from '../services/vehicleService.js'
import GoogleSheetsService from '../services/googleSheetsService.js'
import NotificationService from '../services/notificationService.js'
import { translateMultipleWithCache } from '../services/translationCacheService.js'
import { getActiveBodyTypes } from '../config/bodyTypesConfig.js'

const router = Router()

router.get('/vehicles', async (req, res) => {
  try {
    const { lang = 'nl' } = req.query
    // Try to fetch vehicles from Google Sheets first
    let vehicles = []
    
    try {
      const data = await GoogleSheetsService.getData('Vehicles')
      console.log(`📊 Raw vehicles data from Google Sheets:`, data.length, 'rows')
        console.log(`📊 First few rows:`, data.slice(0, 3))
      
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
            console.log('❌ Missing required NL columns, trying any available columns')
            // Try to find any make/model columns
            const anyMakeIndex = headers.findIndex(h => h.toLowerCase().includes('make'))
            const anyModelIndex = headers.findIndex(h => h.toLowerCase().includes('model'))
            const anyTypeIndex = headers.findIndex(h => h.toLowerCase().includes('type'))
            const anyBodyIndex = headers.findIndex(h => h.toLowerCase().includes('body'))
            
            if (anyMakeIndex === -1 || anyModelIndex === -1) {
              console.log('❌ No make/model columns found at all')
              throw new Error('Missing required columns in Google Sheets')
            }
            
            // Use any available columns
            vehicles = data.slice(1).map(row => ({
              id: row[idIndex] || '',
              make: row[anyMakeIndex] || '',
              model: row[anyModelIndex] || '',
              type: anyTypeIndex !== -1 ? row[anyTypeIndex] || '' : '',
              body: anyBodyIndex !== -1 ? row[anyBodyIndex] || '' : ''
            }))// Remove strict filtering - show all vehicles with any make data
            .filter(vehicle => vehicle.make && vehicle.make.trim() !== '')
          } else {
            // Use NL columns and translate if needed
            vehicles = data.slice(1).map(row => ({
              id: row[idIndex] || '',
              make: row[nlMakeIndex] || '',
              model: row[nlModelIndex] || '',
              type: row[nlTypeIndex] || '',
              body: row[nlBodyIndex] || ''
            }))// Remove strict filtering - show all vehicles with any make data
            .filter(vehicle => vehicle.make && vehicle.make.trim() !== '')
            
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
          }
        } else {
          // Use requested language columns directly
          vehicles = data.slice(1).map(row => ({
            id: row[idIndex] || '',
            make: row[makeIndex] || '',
            model: row[modelIndex] || '',
            type: row[typeIndex] || '',
            body: row[bodyIndex] || ''
          }))// Remove strict filtering - show all vehicles with any make data
          .filter(vehicle => vehicle.make && vehicle.make.trim() !== '')
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

router.get('/vehicles/makes', async (req, res) => {
  try {
    const { lang = 'nl' } = req.query;
    
    // Get all vehicles from Google Sheets and extract unique makes
    const data = await GoogleSheetsService.getData('Vehicles')
    console.log(`📊 Getting vehicle makes, lang: ${lang}`)
    
    if (data.length <= 1) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const headers = data[0];
    const langSuffix = lang.toUpperCase();
    
    // Find column indices
    const makeIndex = headers.indexOf(`Make_${langSuffix}`) !== -1 ? headers.indexOf(`Make_${langSuffix}`) : headers.indexOf('Make_NL');
    
    if (makeIndex === -1) {
      console.log('❌ Missing make column');
      return res.status(500).json({ 
        success: false, 
        error: 'Missing required columns in Google Sheets'
      });
    }
    
    // Get unique makes
    const makesSet = new Set();
    data.slice(1).forEach(row => {
      const vehicleMake = row[makeIndex];
      if (vehicleMake && vehicleMake.trim() !== '') {
        makesSet.add(vehicleMake.trim());
      }
    });
    
    const makes = Array.from(makesSet).sort();
    console.log(`✅ Found ${makes.length} unique makes`);
    
    res.json({
      success: true,
      data: makes
    });
  } catch (error) {
    console.error('Error getting vehicle makes:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get vehicle makes',
      demo: true 
    });
  }
})

router.get('/vehicles/types', async (req, res) => {
  try {
    const { lang = 'nl' } = req.query;
    
    // Get all vehicles from Google Sheets and extract unique types
    const data = await GoogleSheetsService.getData('Vehicles')
    console.log(`📊 Getting vehicle types, lang: ${lang}`)
    
    if (data.length <= 1) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const headers = data[0];
    const langSuffix = lang.toUpperCase();
    
    // Find column indices
    const typeIndex = headers.indexOf(`Type_${langSuffix}`) !== -1 ? headers.indexOf(`Type_${langSuffix}`) : headers.indexOf('Type_NL');
    
    if (typeIndex === -1) {
      console.log('❌ Missing type column');
      return res.status(500).json({ 
        success: false, 
        error: 'Missing required columns in Google Sheets'
      });
    }
    
    // Get unique types
    const typesSet = new Set();
    data.slice(1).forEach(row => {
      const vehicleType = row[typeIndex];
      if (vehicleType && vehicleType.trim() !== '') {
        typesSet.add(vehicleType.trim());
      }
    });
    
    const types = Array.from(typesSet).sort();
    console.log(`✅ Found ${types.length} unique types`);
    
    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    console.error('Error getting vehicle types:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get vehicle types',
      demo: true 
    });
  }
})

router.get('/vehicles/makes/:make/models', async (req, res) => {
  try {
    const { make } = req.params;
    const { lang = 'nl' } = req.query;
    
    // Get all vehicles from Google Sheets and filter by make
    const data = await GoogleSheetsService.getData('Vehicles')
    console.log(`📊 Getting models for make: ${make}, lang: ${lang}`)
    
    if (data.length <= 1) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const headers = data[0];
    const langSuffix = lang.toUpperCase();
    
    // Find column indices
    const idIndex = headers.indexOf('ID');
    const makeIndex = headers.indexOf(`Make_${langSuffix}`) !== -1 ? headers.indexOf(`Make_${langSuffix}`) : headers.indexOf('Make_NL');
    const modelIndex = headers.indexOf(`Model_${langSuffix}`) !== -1 ? headers.indexOf(`Model_${langSuffix}`) : headers.indexOf('Model_NL');
    
    if (makeIndex === -1 || modelIndex === -1) {
      console.log('❌ Missing required columns for models');
      return res.status(500).json({ 
        success: false, 
        error: 'Missing required columns in Google Sheets'
      });
    }
    
    // Get unique models for the specified make
    const modelsSet = new Set();
    data.slice(1).forEach(row => {
      const vehicleMake = row[makeIndex];
      const vehicleModel = row[modelIndex];
      
      if (vehicleMake && vehicleModel && vehicleMake.toLowerCase() === make.toLowerCase()) {
        modelsSet.add(vehicleModel);
      }
    });
    
    const models = Array.from(modelsSet).sort();
    console.log(`✅ Found ${models.length} unique models for make ${make}`);
    
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

// Vehicle services with pricing
router.get('/vehicle-services', async (req, res) => {
  try {
    const { lang = 'nl' } = req.query
    let vehicleServices = []
    
    try {
      // Use the dedicated method from GoogleSheetsService
      vehicleServices = await GoogleSheetsService.getServicesWithPrices()
      console.log(`📊 Vehicle services with prices:`, vehicleServices.length, 'services')
      console.log(`📋 First 3 vehicle services:`, vehicleServices.slice(0, 3))
      
      // Translate if needed (services already have English names by default)
      if (lang !== 'en' && lang !== 'nl') {
        try {
          const namesToTranslate = vehicleServices.map(service => service.name)
          const descsToTranslate = vehicleServices.map(service => service.description)
          
          const [translatedNames, translatedDescs] = await Promise.all([
            translateMultipleWithCache(namesToTranslate, lang),
            translateMultipleWithCache(descsToTranslate, lang)
          ])
          
          vehicleServices = vehicleServices.map((service, index) => ({
            ...service,
            name: translatedNames[index] || service.name,
            description: translatedDescs[index] || service.description
          }))
          
          console.log(`🔄 Translated ${vehicleServices.length} vehicle services to ${lang}`)
        } catch (translationError) {
          console.error('Vehicle services translation error:', translationError)
          // Keep original vehicle services data if translation fails
        }
      }
      
    } catch (error) {
      console.error('❌ Error getting vehicle services:', error)
      // Return empty array instead of error to allow booking modal to work
      vehicleServices = []
    }
    
    return res.json({ 
      success: true, 
      data: vehicleServices 
    })
  } catch (error) {
    console.error('Error getting vehicle services:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get vehicle services'
    })
  }
})

// GET /public/body-types - Obține toate tipurile de caroserie active
router.get('/body-types', async (req, res) => {
  try {
    const bodyTypes = getActiveBodyTypes();
    res.json({
      success: true,
      data: bodyTypes
    });
  } catch (error) {
    console.error('Error fetching body types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch body types'
    });
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
    const { date, time, make, model, type, body, services, user, locale } = req.body
    
    if (!date || !time || !make || !model || !user?.name || !user?.email || !user?.phone) {
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
    
    // Get services data to calculate total and names
    let servicesData = [];
    let servicesList = '';
    let total = 0;
    
    try {
      // Get services names from Services sheet
      const servicesFromSheets = await GoogleSheetsService.getData('Services');
      // Get service prices from Service_Prices sheet
      const servicePricesFromSheets = await GoogleSheetsService.getData('Service_Prices');
      
      if (servicesFromSheets.length > 1) {
        // Parse Services headers
        const servicesHeaders = servicesFromSheets[0];
        const servicesIdIndex = servicesHeaders.indexOf('ID');
        const servicesNameIndex = servicesHeaders.indexOf('Name_NL'); // Default to Dutch
        const servicesPriceIndex = servicesHeaders.indexOf('Price'); // Fallback price from Services sheet
        
        // Parse Service_Prices headers (if available)
        const pricesHeaders = servicePricesFromSheets.length > 1 ? servicePricesFromSheets[0] : [];
        const pricesServiceIdIndex = pricesHeaders.indexOf('Service_ID');
        const pricesBodyTypeIndex = pricesHeaders.indexOf('Body_Type_ID');
        const pricesPriceMinIndex = pricesHeaders.indexOf('Price_Min');
        
        if (servicesIdIndex !== -1 && servicesNameIndex !== -1) {
          
          // Get service names and prices for the selected service IDs
          const serviceNames = [];
          
          console.log('🔍 DEBUG: Looking for services:', services);
          console.log('🔍 DEBUG: Available services in sheet:', servicesFromSheets.slice(1).map(row => ({id: row[servicesIdIndex], name: row[servicesNameIndex]})));
          
          services.forEach(serviceId => {
            console.log('🔍 DEBUG: Processing service ID:', serviceId, 'type:', typeof serviceId);
            // Find service name
            const serviceRow = servicesFromSheets.slice(1).find(row => {
              const rowId = row[servicesIdIndex];
              console.log('🔍 DEBUG: Comparing:', serviceId, '===', rowId, 'type:', typeof rowId);
              return rowId === serviceId;
            });
            
            console.log('🔍 DEBUG: Found service row:', serviceRow);
            
            if (serviceRow) {
              const serviceName = serviceRow[servicesNameIndex] || serviceRow[servicesIdIndex];
              console.log('🔍 DEBUG: Service name:', serviceName);
              serviceNames.push(serviceName);
              
              let servicePrice = 0;
              
              // First try to find price in Service_Prices sheet (if available)
              if (pricesServiceIdIndex !== -1 && pricesBodyTypeIndex !== -1 && pricesPriceMinIndex !== -1) {
                const priceRow = servicePricesFromSheets.slice(1).find(row => 
                  row[pricesServiceIdIndex] === serviceId && row[pricesBodyTypeIndex] === body
                );
                
                if (priceRow) {
                  servicePrice = parseFloat(priceRow[pricesPriceMinIndex]) || 0;
                }
              }
              
              // If no price found in Service_Prices, try to use Price from Services sheet
              if (servicePrice === 0 && servicesPriceIndex !== -1) {
                servicePrice = parseFloat(serviceRow[servicesPriceIndex]) || 0;
              }
              
              console.log('🔍 DEBUG: Service price:', servicePrice);
              total += servicePrice;
            }
          });
          servicesList = serviceNames.join(', ');
          console.log('🔍 DEBUG: Final services list:', servicesList, 'Total:', total);
        }
      }
    } catch (servicesError) {
      console.error('❌ Error fetching services for calculation:', servicesError);
      // Fallback: use services as-is
      servicesList = Array.isArray(services) ? services.join(', ') : services;
      total = 0; // Set to 0 if we can't calculate
    }
    
    // Save booking to Google Sheets
    try {
      
      // Format date and time for display
      const formattedDateTime = `${date} ${time}`;
      
      // Format date and time to prevent Google Sheets auto-conversion
      // Use single quote prefix to force text format (hidden in Google Sheets)
      const formattedDate = `'${date}`;  // '2025-11-30 (appears as 2025-11-30)
      const formattedTime = `'${time}`;  // '14:30 (appears as 14:30)
      
      const bookingData = [
        bookingId,                    // ID (column 0)
        user.name,                    // Name (column 1)
        user.email,                   // Email (column 2)
        user.phone,                   // Phone (column 3)
        formattedDate,                // Date (column 4) - text format
        formattedTime,              // Time (column 5) - text format
        servicesList,                 // Services (column 6)
        total.toString(),             // Total (column 7)
        'confirmed',                  // Status (column 8)
        new Date().toISOString()      // Created At (column 9)
      ];
      
      console.log('💾 Saving booking to Google Sheets:', bookingData);
      const saved = await GoogleSheetsService.appendDataWithFormats('Bookings', bookingData, {
        4: 'TEXT', // Date column - force text format
        5: 'TEXT'  // Time column - force text format
      });
      
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