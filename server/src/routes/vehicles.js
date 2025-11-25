import { Router } from 'express'
import auth from '../middleware/auth.js'
import VehiclesAPIService from '../services/vehiclesAPIService.js'
import GoogleSheetsService from '../services/googleSheetsService.js'
import { translateMultipleWithDeepL } from '../services/deeplTranslationService.js'

import { fallbackModels } from '../data/vehicleData.js'

const router = Router()

// Public routes (no auth required)
// Debug endpoint to check Google Sheets Vehicles data
router.get('/debug', async (req, res) => {
  try {
    console.log('🔍 Debug: Checking Google Sheets Vehicles data...')
    
    const data = await GoogleSheetsService.getData('Vehicles')
    console.log(`📊 Total rows: ${data.length}`)
    
    if (data.length === 0) {
      return res.json({ 
        success: true, 
        message: 'No data in Vehicles sheet',
        data: []
      })
    }
    
    const headers = data[0]
    console.log('📋 Headers:', headers)
    
    // Check column indices for all languages
    const idIndex = headers.indexOf('ID')
    const makeNlIndex = headers.indexOf('Make_NL')
    const makeEnIndex = headers.indexOf('Make_EN')
    const makeEsIndex = headers.indexOf('Make_ES')
    const makePlIndex = headers.indexOf('Make_PL')
    const makeRoIndex = headers.indexOf('Make_RO')
    
    const modelNlIndex = headers.indexOf('Model_NL')
    const modelEnIndex = headers.indexOf('Model_EN')
    const modelEsIndex = headers.indexOf('Model_ES')
    const modelPlIndex = headers.indexOf('Model_PL')
    const modelRoIndex = headers.indexOf('Model_RO')
    
    console.log(`🔍 Multilingual column indices:`)
    console.log(`   ID:${idIndex}`)
    console.log(`   Make - NL:${makeNlIndex}, EN:${makeEnIndex}, ES:${makeEsIndex}, PL:${makePlIndex}, RO:${makeRoIndex}`)
    console.log(`   Model - NL:${modelNlIndex}, EN:${modelEnIndex}, ES:${modelEsIndex}, PL:${modelPlIndex}, RO:${modelRoIndex}`)
    
    // Check first 5 data rows with multilingual data
    const sampleData = data.slice(1, 6).map((row, index) => ({
      rowNumber: index + 2,
      id: row[idIndex] || '',
      make: {
        nl: row[makeNlIndex] || '',
        en: row[makeEnIndex] || '',
        es: row[makeEsIndex] || '',
        pl: row[makePlIndex] || '',
        ro: row[makeRoIndex] || ''
      },
      model: {
        nl: row[modelNlIndex] || '',
        en: row[modelEnIndex] || '',
        es: row[modelEsIndex] || '',
        pl: row[modelPlIndex] || '',
        ro: row[modelRoIndex] || ''
      }
    }))
    
    console.log('📋 Sample data:', sampleData)
    
    // Count valid vehicles using NL data as reference
    let validVehicles = 0
    let invalidRows = []
    
    data.slice(1).forEach((row, index) => {
      const makeNl = row[makeNlIndex]
      const modelNl = row[modelNlIndex]
      if (makeNl && modelNl && makeNl.trim() && modelNl.trim()) {
        validVehicles++
      } else {
        invalidRows.push(index + 2)
      }
    })
    
    console.log(`✅ Found ${validVehicles} valid vehicles out of ${data.length - 1} total rows`)
    if (invalidRows.length > 0) {
      console.log(`⚠️  Invalid rows: ${invalidRows.slice(0, 10).join(', ')}${invalidRows.length > 10 ? '...' : ''}`)
    }
    
    return res.json({ 
      success: true, 
      totalRows: data.length,
      headers: headers,
      multilingualColumnIndices: {
        id: idIndex,
        make: {
          nl: makeNlIndex,
          en: makeEnIndex,
          es: makeEsIndex,
          pl: makePlIndex,
          ro: makeRoIndex
        },
        model: {
          nl: modelNlIndex,
          en: modelEnIndex,
          es: modelEsIndex,
          pl: modelPlIndex,
          ro: modelRoIndex
        }
      },
      validVehicles: validVehicles,
      sampleData: sampleData
    })
    
  } catch (error) {
    console.error('❌ Debug error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

router.get('/', async (req, res) => {
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
              
              const langUpper = lang.toUpperCase();
              const [makesResult, modelsResult, typesResult, bodiesResult] = await Promise.all([
                translateMultipleWithDeepL(makesToTranslate.join('|'), [langUpper], 'nl'),
                translateMultipleWithDeepL(modelsToTranslate.join('|'), [langUpper], 'nl'),
                translateMultipleWithDeepL(typesToTranslate.join('|'), [langUpper], 'nl'),
                translateMultipleWithDeepL(bodiesToTranslate.join('|'), [langUpper], 'nl')
              ])
              
              // Split the translated strings back to arrays
              const translatedMakes = makesResult[langUpper]?.split('|') || makesToTranslate;
              const translatedModels = modelsResult[langUpper]?.split('|') || modelsToTranslate;
              const translatedTypes = typesResult[langUpper]?.split('|') || typesToTranslate;
              const translatedBodies = bodiesResult[langUpper]?.split('|') || bodiesToTranslate;
              
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
      
      try {
        vehicles = await VehiclesAPIService.getAllVehicles()
        console.log(`✅ Fetched ${vehicles.length} vehicles from Vehicles API`)
      } catch (apiError) {
        console.error('❌ Both Google Sheets and Vehicles API failed:', apiError.message)
        throw new Error('Failed to fetch vehicles from any source')
      }
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

// Get all vehicle makes/brands
router.get('/makes', async (req, res) => {
  try {
    // Try to fetch from Vehicles API first
    let makes = []
    
    try {
      const brands = await VehiclesAPIService.getBrands()
      console.log(`📋 Brands from API:`, brands)
      
      if (brands && brands.length > 0) {
        makes = brands.map(brand => brand.brand).sort()
        console.log(`✅ Fetched ${makes.length} makes from Vehicles API`)
      } else {
        console.warn('⚠️  API returned empty brands array, using fallback')
        throw new Error('No brands returned from API')
      }
    } catch (apiError) {
      console.warn('⚠️  Vehicles API failed, using fallback makes:', apiError.message)
      
      // Fallback to comprehensive list of makes
      makes = [
        'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti',
        'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Citroen', 'Dacia', 'Daewoo',
        'Daihatsu', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 'Geely', 'Honda', 'Hummer',
        'Hyundai', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Kia', 'Lada', 'Lamborghini',
        'Lancia', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Maserati', 'Maybach',
        'Mazda', 'McLaren', 'Mercedes-Benz', 'MG', 'Mini', 'Mitsubishi', 'Nissan',
        'Opel', 'Peugeot', 'Porsche', 'Ram', 'Renault', 'Rolls-Royce', 'Rover',
        'Saab', 'Seat', 'Skoda', 'Smart', 'SsangYong', 'Subaru', 'Suzuki', 'Tata',
        'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
      ].sort()
      console.log(`✅ Using fallback makes: ${makes.length} brands`)
    }
    
    console.log(`🚗 Returning ${makes.length} makes`)
    return res.json({ 
      success: true, 
      data: makes 
    })
  } catch (error) {
    console.error('Error getting vehicle makes:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get vehicle makes'
    })
  }
})

// Get all vehicle types/body styles
router.get('/types', async (req, res) => {
  try {
    // Comprehensive list of vehicle types/body styles
    const types = [
      'Sedan', 'Hatchback', 'SUV', 'Coupe', 'Convertible', 'Wagon', 'Van',
      'Pickup', 'Minivan', 'Crossover', 'Roadster', 'Limousine', 'MPV',
      'Sports Car', 'Luxury Car', 'Electric Vehicle', 'Hybrid', 'Diesel',
      'Gasoline', 'Four-Wheel Drive', 'Front-Wheel Drive', 'Rear-Wheel Drive',
      'All-Wheel Drive', 'Commercial Vehicle', 'Truck', 'Bus', 'Motorcycle'
    ].sort()
    
    return res.json({ 
      success: true, 
      data: types 
    })
  } catch (error) {
    console.error('Error getting vehicle types:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get vehicle types'
    })
  }
})

// Get models for a specific make
router.get('/models/:make', async (req, res) => {
  try {
    const { make } = req.params
    let models = []
    
    try {
      // Try to fetch from Vehicles API first
      const vehicles = await VehiclesAPIService.getAllVehicles()
      
      if (vehicles && vehicles.length > 0) {
        // Filter models by make and get unique models
        models = [...new Set(
          vehicles
            .filter(vehicle => vehicle.make.toLowerCase() === make.toLowerCase())
            .map(vehicle => vehicle.model)
        )].sort()
        console.log(`✅ Fetched ${models.length} models for ${make} from Vehicles API`)
      } else {
        throw new Error('No vehicles returned from API')
      }
    } catch (apiError) {
      console.warn(`⚠️  Vehicles API failed for models of ${make}, using fallback:`, apiError.message)
      
      // Fallback to comprehensive model list by make
      
      const makeLower = make.toLowerCase()
      const fallbackMake = Object.keys(fallbackModels).find(key => key.toLowerCase() === makeLower)
      
      if (fallbackMake) {
        models = fallbackModels[fallbackMake]
        console.log(`✅ Using fallback models for ${make}: ${models.length} models`)
      } else {
        // Generic fallback for unknown makes
        models = ['Model 1', 'Model 2', 'Model 3', 'Model 4', 'Model 5']
        console.log(`✅ Using generic fallback models for ${make}: ${models.length} models`)
      }
    }
    
    return res.json({ 
      success: true, 
      data: models 
    })
  } catch (error) {
    console.error(`Error getting models for make ${req.params.make}:`, error)
    res.status(500).json({
      success: false,
      error: 'Failed to get vehicle models'
    })
  }
})

// Admin routes (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { make, model, type, body, year, fuel, transmission } = req.body
    
    if (!make || !model || !type || !body) {
      return res.status(400).json({ 
        success: false,
        error: 'Make, model, type and body are required' 
      })
    }

    const vehicleData = [
      Date.now().toString(), // ID
      make,
      model,
      type,
      body,
      year || '',
      fuel || '',
      transmission || '',
      'true', // Active
      new Date().toISOString(), // Created_Date
      new Date().toISOString()  // Updated_Date
    ]

    const success = await GoogleSheetsService.appendData('Vehicles', vehicleData)
    
    if (!success) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to add vehicle',
        demo: true 
      })
    }

    res.json({ 
      success: true, 
      message: 'Vehicle added successfully' 
    })
  } catch (error) {
    console.error('Error adding vehicle:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add vehicle',
      demo: true 
    })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { make, model, type, body, year, fuel, transmission, active } = req.body

    const data = await GoogleSheetsService.getData('Vehicles')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No vehicles found' 
      })
    }

    const rowIndex = data.slice(1).findIndex(row => row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vehicle not found' 
      })
    }

    const updatedData = [
      id,
      make || data[rowIndex + 1][1],
      model || data[rowIndex + 1][2],
      type || data[rowIndex + 1][3],
      body || data[rowIndex + 1][4],
      year || data[rowIndex + 1][5] || '',
      fuel || data[rowIndex + 1][6] || '',
      transmission || data[rowIndex + 1][7] || '',
      active !== undefined ? active.toString() : data[rowIndex + 1][8],
      data[rowIndex + 1][9], // Created_Date (keep original)
      new Date().toISOString() // Updated_Date
    ]

    const success = await GoogleSheetsService.updateData('Vehicles', rowIndex, updatedData)
    
    if (!success) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to update vehicle',
        demo: true 
      })
    }

    res.json({ 
      success: true, 
      message: 'Vehicle updated successfully' 
    })
  } catch (error) {
    console.error('Error updating vehicle:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update vehicle',
      demo: true 
    })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params

    const data = await GoogleSheetsService.getData('Vehicles')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No vehicles found' 
      })
    }

    const rowIndex = data.slice(1).findIndex(row => row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vehicle not found' 
      })
    }

    const success = await GoogleSheetsService.deleteData('Vehicles', rowIndex)
    
    if (!success) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to delete vehicle',
        demo: true 
      })
    }

    res.json({ 
      success: true, 
      message: 'Vehicle deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete vehicle',
      demo: true 
    })
  }
})

export default router