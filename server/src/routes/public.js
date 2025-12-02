import { Router } from 'express'
import { getRange, appendRange } from '../services/sheets.js'
import { translateText } from '../services/translator.js'
import VehicleService from '../services/vehicleService.js'
import GoogleSheetsService from '../services/googleSheetsService.js'
import NotificationService from '../services/notificationService.js'
import { getActiveBodyTypes } from '../config/bodyTypesConfig.js'
import { translateMultipleWithDeepL, detectLanguageWithDeepL } from '../services/deeplTranslationService.js'
import CloudinaryService from '../services/cloudinaryService.js'
import { sendBookingConfirmation, sendAdminNotification } from '../services/emailService.js'

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
                
                // Use DeepL for vehicle translations
                try {
                  const { translateMultipleWithDeepL } = await import('./services/deeplTranslationService.js');
                  
                  const [makesResult, modelsResult, typesResult, bodiesResult] = await Promise.all([
                    translateMultipleWithDeepL(makesToTranslate.join(' | '), [lang.toUpperCase()], 'NL'),
                    translateMultipleWithDeepL(modelsToTranslate.join(' | '), [lang.toUpperCase()], 'NL'),
                    translateMultipleWithDeepL(typesToTranslate.join(' | '), [lang.toUpperCase()], 'NL'),
                    translateMultipleWithDeepL(bodiesToTranslate.join(' | '), [lang.toUpperCase()], 'NL')
                  ]);
                  
                  const translatedMakes = makesResult[lang.toUpperCase()].split(' | ');
                  const translatedModels = modelsResult[lang.toUpperCase()].split(' | ');
                  const translatedTypes = typesResult[lang.toUpperCase()].split(' | ');
                  const translatedBodies = bodiesResult[lang.toUpperCase()].split(' | ');
                  
                  vehicles = vehicles.map((vehicle, index) => ({
                    ...vehicle,
                    make: translatedMakes[index] || vehicle.make,
                    model: translatedModels[index] || vehicle.model,
                    type: translatedTypes[index] || vehicle.type,
                    body: translatedBodies[index] || vehicle.body
                  }));
                } catch (translationError) {
                  console.error('DeepL translation error:', translationError);
                  // Keep original vehicles data if translation fails
                }
                
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
    
    // Try to fetch services from Google Sheets first with DeepL Translate integration
    try {
      // Use the new DeepL Translate method for services
      if (lang !== 'nl') {
        console.log(`🔄 Using DeepL Translate for services in language: ${lang}`)
        services = await GoogleSheetsService.getServicesWithDeepLTranslation(lang, true, true)
      } else {
        // For Dutch, use the standard method
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
        }
      }
      
      console.log(`✅ Parsed ${services.length} services from Google Sheets`)
      console.log(`📋 First 3 services:`, services.slice(0, 3))
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
      vehicleServices = await GoogleSheetsService.getServicesWithPrices(lang)
      console.log(`📊 Vehicle services with prices:`, vehicleServices.length, 'services')
      console.log(`📋 First 3 vehicle services:`, vehicleServices.slice(0, 3))
      
      // Translate if needed - services are in English by default from Google Sheets
      if (lang === 'nl') {
        // For Dutch, use the original English text as Dutch (since Argos API doesn't support Dutch translation)
        // The Google Sheets data is already in English, so we use it as-is for Dutch
        console.log(`🇳🇱 Using original English text as Dutch for ${vehicleServices.length} vehicle services`)
        // No translation needed - English text serves as Dutch default
      } else if (lang !== 'en') {
        // For other languages, translate from English using DeepL
        try {
          const namesToTranslate = vehicleServices.map(service => service.name)
          const descsToTranslate = vehicleServices.map(service => service.description)
          
          const { translateMultipleWithDeepL } = await import('./services/deeplTranslationService.js');
          
          const [namesResult, descsResult] = await Promise.all([
            translateMultipleWithDeepL(namesToTranslate.join(' | '), [lang.toUpperCase()], 'EN'),
            translateMultipleWithDeepL(descsToTranslate.join(' | '), [lang.toUpperCase()], 'EN')
          ]);
          
          const translatedNames = namesResult[lang.toUpperCase()].split(' | ');
          const translatedDescs = descsResult[lang.toUpperCase()].split(' | ');
          
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
    
    if (date) {
      // Check if the specific date has any bookings
      const checkDate = new Date(date);
      const dateString = date; // Format: YYYY-MM-DD
      
      try {
        // Get all bookings from Google Sheets
        const data = await GoogleSheetsService.getData('Bookings');
        
        if (data.length <= 1) {
          // No bookings found, date is available
          res.json({ 
            success: true,
            available: true,
            date: date,
            message: 'No bookings found for this date'
          });
          return;
        }

        // Check if any booking exists for this date
        const hasBookingForDate = data.slice(1).some((row) => {
          const bookingDate = row[4] || ''; // Date column
          const bookingStatus = row[8] || 'pending'; // Status column
          
          // Remove any single quotes from date and normalize format
          const cleanBookingDate = bookingDate.replace(/^'/, '');
          
          // Check if this booking is for the requested date and is not cancelled
          return cleanBookingDate === dateString && bookingStatus !== 'cancelled';
        });

        res.json({ 
          success: true,
          available: !hasBookingForDate,
          date: date,
          hasBooking: hasBookingForDate
        });
        
      } catch (sheetsError) {
        console.error('Error reading from Google Sheets:', sheetsError);
        // Fallback: consider date available if Sheets error
        res.json({ 
          success: true,
          available: true,
          date: date,
          error: 'Could not check bookings, assuming available'
        });
      }
    } else {
      // Get all booked dates (for calendar coloring)
      try {
        const data = await GoogleSheetsService.getData('Bookings');
        
        if (data.length <= 1) {
          res.json({ 
            success: true,
            bookedDates: [],
            available: true
          });
          return;
        }

        // Extract all booked dates
        const bookedDates = data.slice(1)
          .filter((row) => {
            const bookingDate = row[4] || '';
            const bookingStatus = row[8] || 'pending';
            return bookingDate && bookingStatus !== 'cancelled';
          })
          .map((row) => {
            const bookingDate = row[4] || '';
            return bookingDate.replace(/^'/, ''); // Remove single quotes
          })
          .filter((date, index, array) => array.indexOf(date) === index); // Remove duplicates

        res.json({ 
          success: true,
          bookedDates: bookedDates,
          available: true
        });
        
      } catch (sheetsError) {
        console.error('Error reading booked dates from Google Sheets:', sheetsError);
        res.json({ 
          success: true,
          bookedDates: [],
          available: true,
          error: 'Could not retrieve booked dates'
        });
      }
    }
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check availability'
    });
  }
})

router.post('/bookings', async (req, res) => {
  const startTime = Date.now();
  console.log(`🚀 Booking request started at ${new Date().toISOString()}`);
  
  // Add overall timeout protection for the entire endpoint - reduced to 15 seconds
  const requestTimeout = setTimeout(() => {
    const elapsed = Date.now() - startTime;
    console.error(`❌ Booking endpoint timeout after ${elapsed}ms - sending error response`);
    if (!res.headersSent) {
      res.status(504).json({ 
        success: false,
        error: 'Request timeout - server took too long to process',
        demo: true 
      });
    }
  }, 15000); // 15 second overall timeout (reduced from 25)
  
  try {
    const { date, time, make, model, type, body, services, user, locale, newsletter } = req.body
    
    console.log(`📋 Booking data received: ${services?.length || 0} services, user: ${user?.email || 'unknown'}, newsletter: ${newsletter || false}`);
    
    if (!date || !time || !make || !model || !user?.name || !user?.email || !user?.phone) {
      clearTimeout(requestTimeout);
      console.log(`❌ Missing required fields in booking request`);
      return res.status(400).json({ 
        success: false,
        error: 'Toate câmpurile sunt obligatorii' 
      })
   }
    
    const bookingId = Date.now().toString()
    
    // Get services data to calculate total and names - with optimized parallel fetching
    let servicesList = '';
    let total = 0;
    
    try {
      const servicesStartTime = Date.now();
      console.log(`🔍 Starting services data fetch...`);
      
      // Create optimized timeout for Google Sheets operations (2 seconds)
      const sheetsTimeout = new Promise((resolve) => {
        setTimeout(() => resolve(null), 2000); // 2 second timeout
      });
      
      // Fetch both sheets in parallel with timeout
      const servicesPromise = GoogleSheetsService.getData('Services');
      const pricesPromise = GoogleSheetsService.getData('Service_Prices');
      
      const [servicesFromSheets, servicePricesFromSheets] = await Promise.all([
        Promise.race([servicesPromise, sheetsTimeout]),
        Promise.race([pricesPromise, sheetsTimeout])
      ]);
      
      const servicesFetchTime = Date.now() - servicesStartTime;
      console.log(`✅ Services data fetch completed in ${servicesFetchTime}ms`);
      
      if (!servicesFromSheets) {
        console.log('⚠️  Google Sheets services request timed out, using fallback');
        throw new Error('Google Sheets timeout');
      }
      
      // Use empty array if prices timed out
      const pricesData = servicePricesFromSheets || [];
      
      if (servicesFromSheets.length > 1) {
        // Parse Services headers
        const servicesHeaders = servicesFromSheets[0];
        const servicesIdIndex = servicesHeaders.indexOf('ID');
        const servicesNameIndex = servicesHeaders.indexOf('Name_NL'); // Default to Dutch
        const servicesPriceIndex = servicesHeaders.indexOf('Price'); // Fallback price from Services sheet
        
        // Parse Service_Prices headers (if available)
        const pricesHeaders = pricesData.length > 1 ? pricesData[0] : [];
        const pricesServiceIdIndex = pricesHeaders.indexOf('Service_ID');
        const pricesBodyTypeIndex = pricesHeaders.indexOf('Body_Type_ID');
        const pricesPriceMinIndex = pricesHeaders.indexOf('Price_Min');
        
        if (servicesIdIndex !== -1 && servicesNameIndex !== -1) {
          
          // Get service names and prices for the selected service IDs - optimized
          const serviceNames = [];
          
          // Pre-process services data for faster lookup
          const servicesMap = new Map();
          servicesFromSheets.slice(1).forEach(row => {
            const rowId = String(row[servicesIdIndex]).trim();
            servicesMap.set(rowId, row);
          });
          
          // Pre-process prices data for faster lookup
          const pricesMap = new Map();
          if (pricesData.length > 1 && pricesServiceIdIndex !== -1 && pricesBodyTypeIndex !== -1) {
            pricesData.slice(1).forEach(row => {
              const key = `${String(row[pricesServiceIdIndex]).trim()}_${String(row[pricesBodyTypeIndex]).trim()}`;
              pricesMap.set(key, row);
            });
          }
          
          services.forEach(serviceId => {
            const serviceRow = servicesMap.get(String(serviceId).trim());
            
            if (serviceRow) {
              const serviceName = serviceRow[servicesNameIndex] || serviceRow[servicesIdIndex];
              serviceNames.push(serviceName);
              
              let servicePrice = 0;
              
              // Optimized price lookup using pre-built map
              if (pricesServiceIdIndex !== -1 && pricesBodyTypeIndex !== -1 && pricesPriceMinIndex !== -1) {
                const priceKey = `${String(serviceId).trim()}_${String(body).trim()}`;
                const priceRow = pricesMap.get(priceKey);
                if (priceRow) {
                  servicePrice = parseFloat(priceRow[pricesPriceMinIndex]) || 0;
                }
              }
              
              // If no price found in Service_Prices, try to use Price from Services sheet
              if (servicePrice === 0 && servicesPriceIndex !== -1) {
                servicePrice = parseFloat(serviceRow[servicesPriceIndex]) || 0;
              }
              
              total += servicePrice;
            }
          });
          servicesList = serviceNames.join(', ');
        }
      }
    } catch (servicesError) {
      console.error('❌ Error fetching services for calculation:', servicesError);
      // Fallback: use services as-is
      servicesList = Array.isArray(services) ? services.join(', ') : services;
      total = 0; // Set to 0 if we can't calculate
    }
    
    // Save booking to Google Sheets with optimized timeout - fire and forget approach
    // This operation will continue in background after response is sent
    const saveBookingAsync = async () => {
      try {
        // Format date and time to prevent Google Sheets auto-conversion
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
        
        console.log('💾 Saving booking to Google Sheets (async):', bookingData);
        
        // Quick timeout for save operation (3 seconds)
        const saveTimeout = new Promise((resolve) => {
          setTimeout(() => {
            console.log('⚠️  Google Sheets save operation timed out (async)');
            resolve(false);
          }, 3000); // 3 second timeout
        });
        
        const savePromise = GoogleSheetsService.appendDataWithFormats('Bookings', bookingData, {
          4: 'TEXT', // Date column - force text format
          5: 'TEXT'  // Time column - force text format
        });
        
        const saved = await Promise.race([savePromise, saveTimeout]);
        
        if (saved) {
          console.log('✅ Booking saved successfully to Google Sheets (async)');
        } else {
          console.log('⚠️  Booking save failed or timed out (async), but continuing');
        }
      } catch (sheetsError) {
        console.error('❌ Google Sheets error (async):', sheetsError);
        // Silent fail - don't affect user experience
      }
    };
    
    // Send email notifications asynchronously (fire and forget)
    const sendEmailsAsync = async () => {
      try {
        console.log('📧 Sending email notifications for booking (async):', bookingId);
        
        // Check if email service is configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
          console.warn('⚠️ Email service not configured - skipping email notifications');
          console.warn(`⚠️ EMAIL_USER: ${process.env.EMAIL_USER ? 'SET' : 'MISSING'}, EMAIL_PASS: ${process.env.EMAIL_PASS ? 'SET' : 'MISSING'}`);
          return;
        }
        
        // Prepare services data for emails
        const emailServices = servicesList.split(', ').map(serviceName => ({
          name: serviceName,
          description: 'Serviciu auto detailing',
          price: total > 0 ? (total / servicesList.split(', ').length).toFixed(2) : '0'
        }));
        
        // Send confirmation email to client
        console.log(`📧 Sending client confirmation email to: ${req.body.user.email}`);
        const clientEmailResult = await sendBookingConfirmation(req.body, emailServices);
        if (clientEmailResult.success) {
          console.log('✅ Client confirmation email sent successfully (async)');
        } else {
          console.error('❌ Failed to send client confirmation email (async):', clientEmailResult.error);
        }
        
        // Send notification email to admin
        console.log('📧 Sending admin notification email to: spectraautoart@gmail.com');
        const adminEmailResult = await sendAdminNotification(req.body, emailServices);
        if (adminEmailResult.success) {
          console.log('✅ Admin notification email sent successfully (async)');
        } else {
          console.error('❌ Failed to send admin notification email (async):', adminEmailResult.error);
        }
        
      } catch (notificationError) {
        console.error('❌ Email notification error (async):', notificationError);
      }
    };
    
    // Process newsletter subscription if user checked the checkbox
    const processNewsletterAsync = async () => {
      try {
        if (newsletter === true && user?.email) {
          console.log('💾 Processing newsletter subscription for booking user:', user.email);
          
          // Get client IP for newsletter subscription
          const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
          
          // Save to Google Sheets using the same method as the newsletter endpoint
          const saved = await GoogleSheetsService.addNewsletterSubscriber(user.email, user.name || '', locale || 'nl', ip);
          
          if (saved) {
            console.log('✅ Newsletter subscription saved successfully from booking:', user.email);
          } else {
            console.log('⚠️  Newsletter subscription failed from booking, but continuing');
          }
        } else {
          console.log('ℹ️  No newsletter subscription requested or no email provided');
        }
      } catch (newsletterError) {
        console.error('❌ Newsletter subscription error (async):', newsletterError);
        // Silent fail - don't affect booking process
      }
    };
    
    // Start async operations but don't wait for them
    saveBookingAsync();
    processNewsletterAsync();
    sendEmailsAsync();
    
    const totalTime = Date.now() - startTime;
    console.log(`✅ Booking request completed successfully in ${totalTime}ms`);
    
    clearTimeout(requestTimeout);
    res.status(201).json({ 
      success: true, 
      bookingId,
      message: 'Programarea a fost confirmată',
      performance: {
        totalTime: `${totalTime}ms`,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    const totalTime = Date.now() - startTime;
    clearTimeout(requestTimeout);
    console.error(`❌ Error creating booking after ${totalTime}ms:`, error);
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

// GET /public/testimonials - Get testimonials from Google Sheets
router.get('/testimonials', async (req, res) => {
  try {
    const { lang = 'nl' } = req.query
    
    console.log('🎯 Testimonials route hit with lang:', lang)
    console.log('📋 Full query:', req.query)
    
    // Use DeepL for testimonial translations
    let testimonials = [];
    console.log(`🔄 Processing testimonials for language: ${lang}`)
    
    try {
      console.log('🔄 Using DeepL Translate for testimonials...')
      
      // Create a timeout promise that rejects after 15 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Translation timeout - exceeded 15 seconds')), 15000)
      })
      
      // Race between translation and timeout
      const limitedTestimonials = await Promise.race([
        GoogleSheetsService.getTestimonialsWithDeepLTranslation(lang, true, true),
        timeoutPromise
      ])
      
      // Limit results to prevent performance issues
      testimonials = limitedTestimonials.slice(0, 10)
      console.log('✅ DeepL Translate successful, testimonials count (limited to 10):', testimonials.length)
    } catch (error) {
      console.log('⚠️ Translation failed:', error.message)
      // Return empty array if translation fails
      testimonials = []
    }
    
    console.log('✅ Processed testimonials:', testimonials.length, 'items');
    console.log('📤 Sending response immediately...');
    
    // Send response immediately
    return res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error getting testimonials:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get testimonials'
    })
  }
})

// POST /public/testimonials - Submit a new testimonial
router.post('/testimonials', async (req, res) => {
  try {
    const { name, rating, comment } = req.body
    
    // Validate input
    if (!name || !comment || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Name, rating, and comment are required'
      })
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      })
    }
    
    if (name.length > 100 || comment.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Name too long (max 100) or comment too long (max 1000)'
      })
    }
    
    console.log('📝 New testimonial submission:', { name, rating, comment: comment.substring(0, 50) + '...' })
    
    // Get current date in ISO format
    const currentDate = new Date().toISOString();
    const currentDateOnly = currentDate.split('T')[0]; // YYYY-MM-DD format
    
    // Use DeepL for language detection
    let detectedLanguage;
    try {
      detectedLanguage = await detectLanguageWithDeepL(comment);
      console.log(`🔍 DeepL detected language: ${detectedLanguage} for comment: "${comment.substring(0, 50)}..."`);
    } catch (error) {
      console.error(`❌ DeepL language detection failed:`, error.message);
      // Fallback to enhanced Romanian detection
      const textLower = comment.toLowerCase();
      if (/\b(foarte|mulțumit|servicii|personalul|profesionist|atent|detalii|recomand|încredere|excelent|superb|calitate)\b/.test(textLower) || 
          /[ăâîșțĂÂÎȘȚ]/.test(comment) ||
          comment.includes('mulțumesc') || 
          comment.includes('sunt') || 
          comment.includes('foarte')) {
        detectedLanguage = 'ro';
        console.log(`🔍 Fallback detection: Romanian language detected for comment: "${comment.substring(0, 50)}..."`);
      } else {
        detectedLanguage = 'en'; // Default to English
        console.log(`🔍 Fallback detection: English language detected for comment: "${comment.substring(0, 50)}..."`);
      }
    }
    
    // Map detected language to column suffix
    const languageMap = {
      'eng': 'EN',
      'nld': 'NL', 
      'ron': 'RO',
      'spa': 'ES',
      'pol': 'PL'
    };
    
    const detectedSuffix = languageMap[detectedLanguage] || 'EN'; // Default to English if uncertain
    console.log(`📝 Will translate from ${detectedSuffix} to all languages`);
    
    // Translate to all languages using DeepL
    const translations = {};
    const targetLanguages = ['NL', 'EN', 'ES', 'PL', 'RO'];
    
    try {
      console.log(`🔄 Starting DeepL translation for ${targetLanguages.length} languages...`);
      
      // Process translations using DeepL (translate to all languages)
      const translationPromises = targetLanguages.map(async (lang) => {
        // Translate using DeepL for all languages
        try {
          const result = await translateMultipleWithDeepL(comment, [lang], detectedLanguage);
          const translatedText = result[lang] || comment;
          translations[lang] = translatedText;
          console.log(`✅ DeepL translation to ${lang}: ${translatedText.substring(0, 50)}...`);
        } catch (error) {
          console.error(`❌ DeepL translation failed for ${lang}:`, error.message);
          translations[lang] = comment; // Fallback to original
        }
      });
      
      await Promise.all(translationPromises);
      console.log(`✅ All DeepL translations completed!`);
      
    } catch (error) {
      console.error(`❌ DeepL translation system failed:`, error);
      // Fallback: use original text for all languages
      targetLanguages.forEach(lang => {
        translations[lang] = comment;
      });
    }
    
    // Create new testimonial data with proper structure for Google Sheets
    // ID, Name, Rating, Comment_NL, Comment_EN, Comment_ES, Comment_PL, Comment_RO, Active, Created_Date
    const newTestimonial = [
      `test-${Date.now()}`,    // ID
      name,                    // Name
      rating.toString(),       // Rating
      translations['NL'] || comment,  // Comment_NL
      translations['EN'] || comment,  // Comment_EN
      translations['ES'] || comment,  // Comment_ES
      translations['PL'] || comment,  // Comment_PL
      translations['RO'] || comment,  // Comment_RO
      'true',                  // Active
      currentDateOnly          // Created_Date (format YYYY-MM-DD)
    ]
    
    try {
      // Append to Google Sheets
      await GoogleSheetsService.appendData('Testimonials', newTestimonial)
      
      console.log('✅ New testimonial submitted successfully:', { name, rating, comment, date: currentDateOnly })
      
      res.json({
        success: true,
        message: 'Testimonial submitted successfully',
        testimonial: {
          id: newTestimonial[0],
          name,
          rating,
          comment,
          date: currentDateOnly,
          service: ''
        }
      })
    } catch (sheetsError) {
      console.error('❌ Error saving to Google Sheets:', sheetsError)
      res.status(500).json({
        success: false,
        error: 'Failed to save testimonial to database'
      })
    }
  } catch (error) {
    console.error('Error submitting testimonial:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to submit testimonial'
    })
  }
})

// GET /public/gallery - Get gallery images from Google Sheets with Cloudinary support
router.get('/gallery', async (req, res) => {
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
        url: image.image_url || '', // Image URL column contains actual image URL
        title: image.title || '', // Title column contains title for Gallery component
        description: image.description || '', // Description column contains description for Gallery component
        category: image.category || 'general', // Category column contains category
        active: image.active ? (image.active.toString().toLowerCase() === 'true') : true, // Active column contains active status
        created_date: image.upload_date || '', // Upload_Date column contains upload date
        updated_date: image.upload_date || ''  // Upload_Date column contains upload date
      }
    }).filter(image => image.url && image.id)

    // Filter out images without valid URL (exclude simple words like "interior", "general")
    const filteredImages = images.filter(image => {
      const hasUrl = image.url && image.id
      const isValidUrl = image.url.includes('/') || image.url.startsWith('http') || image.url.endsWith('.jpg') || image.url.endsWith('.jpeg') || image.url.endsWith('.png') || image.url.endsWith('.gif') || image.url.endsWith('.webp')
      return hasUrl && isValidUrl
    })
    
    console.log('🔍 Images after filtering:', filteredImages.length, 'from', images.length)
    
    // Log all URLs to understand the data structure
    filteredImages.forEach((image, index) => {
      console.log(`🖼️ Image ${index + 1}: ID="${image.id}", URL="${image.url}", Category="${image.category}"`)
    })
    
    // Process images to ensure proper Cloudinary URLs
    const processedImages = filteredImages.map(image => {
      let processedUrl = image.url
      
      // If URL is from Cloudinary, ensure it uses HTTPS and has proper format
      if (image.url.includes('cloudinary.com')) {
        // Ensure HTTPS protocol
        if (image.url.startsWith('http://')) {
          processedUrl = image.url.replace('http://', 'https://')
        }
        
        // Log Cloudinary URL processing
        console.log(`☁️ Processing Cloudinary URL: ${image.url} -> ${processedUrl}`)
      }
      
      // For local URLs, ensure they're properly formatted
      else if (image.url.startsWith('/uploads/')) {
        const baseUrl = process.env.API_URL || 'http://localhost:8080'
        processedUrl = `${baseUrl}${image.url}`
        console.log(`📁 Processing local URL: ${image.url} -> ${processedUrl}`)
      }
      
      // For Google Drive URLs, use as-is (they should already be proper URLs)
      else if (image.url.includes('drive.google.com') || image.url.includes('googleusercontent.com')) {
        console.log(`📄 Processing Google Drive URL: ${image.url}`)
        processedUrl = image.url
      }
      
      return {
        ...image,
        url: processedUrl
      }
    })
    
    // Translate gallery images if language is not Dutch
    let translatedImages = processedImages
    if (lang !== 'nl') {
      try {
        // Extract descriptions that need translation
        const descriptionsToTranslate = processedImages.map(img => img.description)

        // Translate all descriptions
        const translatedDescriptionsResult = await translateMultipleWithDeepL(descriptionsToTranslate.join('|'), [lang.toUpperCase()], 'nl');
        const translatedDescriptions = translatedDescriptionsResult[lang.toUpperCase()]?.split('|') || descriptionsToTranslate;

        // Create translated images
        translatedImages = processedImages.map((image, index) => ({
          ...image,
          title: translatedDescriptions[index] || image.title,
          description: translatedDescriptions[index] || image.description
        }))
      } catch (translationError) {
        console.error('Translation error:', translationError)
        // Fallback to original images
        translatedImages = processedImages
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

// GET /public/gallery/cloudinary - Get gallery images directly from Cloudinary with Google Sheets sync
router.get('/gallery/cloudinary', async (req, res) => {
  try {
    const { lang = 'nl', folder = 'gallery', max = 100 } = req.query
    
    console.log(`🖼️ Getting gallery images from Cloudinary folder: ${folder}`)
    console.log(`📊 Query params: lang=${lang}, folder=${folder}, max=${max}`)
    
    // Get images from Cloudinary
    const result = await CloudinaryService.getImagesFromFolder(folder, parseInt(max))
    
    if (!result.success) {
      console.error('❌ Failed to get images from Cloudinary:', result.error)
      console.error('❌ Cloudinary error details:', result)
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to get images from Cloudinary',
        details: result.error
      })
    }
    
    console.log(`✅ Found ${result.data.length} images in Cloudinary`)
    
    // Get gallery metadata from Google Sheets
    let googleSheetsData = []
    try {
      const sheetsData = await GoogleSheetsService.getData('Gallery')
      console.log(`📊 Retrieved ${sheetsData.length} rows from Google Sheets Gallery`)
      
      if (sheetsData.length > 1) {
        const headers = sheetsData[0]
        googleSheetsData = sheetsData.slice(1).map(row => {
          const imageData = {}
          headers.forEach((header, index) => {
            imageData[header.toLowerCase().replace(/ /g, '_')] = row[index] || ''
          })
          return {
            id: imageData.id || '',
            title: imageData.title || '',
            description: imageData.description || '',
            category: imageData.category || 'general',
            active: imageData.active ? (imageData.active.toString().toLowerCase() === 'true') : true,
            upload_date: imageData.upload_date || ''
          }
        })
      }
    } catch (sheetsError) {
      console.warn('⚠️ Could not retrieve Google Sheets data:', sheetsError.message)
      // Continue without Google Sheets data
    }
    
    // Process images and merge with Google Sheets data
    console.log(`📊 Processing ${result.data.length} Cloudinary images with ${googleSheetsData.length} Google Sheets entries`)
    
    const processedImages = result.data.map(image => {
      console.log(`🔍 Looking for metadata for image ID: "${image.id}", URL: "${image.url}"`)
      
      // Try to find matching Google Sheets data by image ID or URL
      const sheetsMetadata = googleSheetsData.find(sheet => {
        const match = sheet.id === image.id || 
                     sheet.id === image.public_id ||
                     image.url.includes(sheet.id) ||
                     (sheet.image_url && image.url === sheet.image_url)
        
        if (match) {
          console.log(`✅ Found metadata match for "${image.id}":`, {
            title: sheet.title,
            description: sheet.description,
            category: sheet.category
          })
        }
        
        return match
      })
      
      if (!sheetsMetadata) {
        console.log(`⚠️ No metadata found for image "${image.id}", using defaults`)
      }
      
      return {
        id: image.id,
        url: image.url,
        title: sheetsMetadata?.title || image.title || 'Gallery Image',
        description: sheetsMetadata?.description || image.description || '',
        category: sheetsMetadata?.category || image.category || 'general',
        active: sheetsMetadata?.active !== undefined ? sheetsMetadata.active : true,
        created_date: image.created_date,
        updated_date: image.updated_date,
        width: image.width,
        height: image.height,
        size: image.size,
        has_sheets_metadata: !!sheetsMetadata
      }
    })
    
    // Translate descriptions if language is not Dutch
    let translatedImages = processedImages
    if (lang !== 'nl' && processedImages.some(img => img.description)) {
      try {
        const descriptionsToTranslate = processedImages.map(img => img.description)
        const translatedDescriptionsResult = await translateMultipleWithDeepL(descriptionsToTranslate.join('|'), [lang.toUpperCase()], 'nl')
        const translatedDescriptions = translatedDescriptionsResult[lang.toUpperCase()]?.split('|') || descriptionsToTranslate
        
        translatedImages = processedImages.map((image, index) => ({
          ...image,
          description: translatedDescriptions[index] || image.description
        }))
        
        console.log(`🔄 Translated ${translatedImages.length} image descriptions to ${lang}`)
      } catch (translationError) {
        console.warn('⚠️ Translation failed, using original descriptions:', translationError.message)
        translatedImages = processedImages
      }
    }
    
    console.log(`✅ Returning ${translatedImages.length} gallery images (${translatedImages.filter(img => img.has_sheets_metadata).length} with Google Sheets metadata)`)
    res.json({
      success: true,
      data: translatedImages
    })
    
  } catch (error) {
    console.error('Error getting Cloudinary gallery images:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get Cloudinary gallery images'
    })
  }
})

export default router