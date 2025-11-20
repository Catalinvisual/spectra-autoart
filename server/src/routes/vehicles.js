import { Router } from 'express'
import auth from '../middleware/auth.js'
import VehiclesAPIService from '../services/vehiclesAPIService.js'
import GoogleSheetsService from '../services/googleSheetsService.js'
import { translateMultipleWithCache } from '../services/translationCacheService.js'

const router = Router()

// Public routes (no auth required)
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
        const idIndex = headers.indexOf('ID')
        const makeIndex = headers.indexOf('Make')
        const modelIndex = headers.indexOf('Model')
        const typeIndex = headers.indexOf('Type')
        const bodyIndex = headers.indexOf('Body')
        
        vehicles = data.slice(1).map(row => ({
          id: row[idIndex] || '',
          make: row[makeIndex] || '',
          model: row[modelIndex] || '',
          type: row[typeIndex] || '',
          body: row[bodyIndex] || ''
        })).filter(vehicle => vehicle.make && vehicle.model) // Filter out empty rows
        
        console.log(`✅ Parsed ${vehicles.length} vehicles from Google Sheets`)
        
        // Translate vehicle data if language is not Dutch
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
            
            console.log(`🔄 Translated ${vehicles.length} vehicles to ${lang}`)
          } catch (translationError) {
            console.error('Translation error:', translationError)
            // Keep original vehicles data if translation fails
          }
        }
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
      const fallbackModels = {
        'BMW': ['Seria 1', 'Seria 2', 'Seria 3', 'Seria 4', 'Seria 5', 'Seria 6', 'Seria 7', 'Seria 8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'iX', 'M2', 'M3', 'M4', 'M5', 'X5 M', 'X6 M'],
        'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q4', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron', 'e-tron GT', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'SQ5', 'SQ7', 'SQ8'],
        'Mercedes-Benz': ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class', 'SL', 'SLC', 'AMG GT', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'C 63 AMG', 'E 63 AMG', 'S 63 AMG', 'G 63 AMG'],
        'Volkswagen': ['Golf', 'Passat', 'Polo', 'Tiguan', 'Touareg', 'T-Roc', 'T-Cross', 'Arteon', 'CC', 'Scirocco', 'Jetta', 'Beetle', 'Transporter', 'Caddy', 'Amarok', 'ID.3', 'ID.4', 'ID.5', 'Golf GTI', 'Golf R', 'Tiguan R'],
        'Toyota': ['Corolla', 'Camry', 'RAV4', 'Highlander', 'C-HR', 'Yaris', 'Auris', 'Avensis', 'Verso', 'Prius', 'Land Cruiser', 'Hilux', 'Proace', 'Supra', 'GT86', 'Mirai', 'bZ4X'],
        'Honda': ['Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz', 'Insight', 'CR-Z', 'Pilot', 'Passport', 'Ridgeline', 'Odyssey', 'Stream', 'Legend', 'NSX', 'e', 'Clarity'],
        'Ford': ['Focus', 'Fiesta', 'Mondeo', 'Kuga', 'Puma', 'EcoSport', 'Edge', 'Explorer', 'Mustang', 'GT', 'Ranger', 'Transit', 'Tourneo', 'Galaxy', 'S-MAX', 'C-MAX', 'B-MAX', 'Ka+', 'F-150', 'Bronco'],
        'Renault': ['Clio', 'Megane', 'Scenic', 'Captur', 'Kadjar', 'Koleos', 'Talisman', 'Espace', 'Twingo', 'Zoe', 'Kangoo', 'Trafic', 'Master', 'Alpine', 'R.S.'],
        'Peugeot': ['208', '308', '508', '2008', '3008', '5008', 'Partner', 'Expert', 'Boxer', 'RCZ', '308 R', '508 PSE'],
        'Citroen': ['C1', 'C3', 'C4', 'C5', 'C3 Aircross', 'C4 Cactus', 'C5 Aircross', 'Berlingo', 'Jumpy', 'Jumper', 'DS3', 'DS4', 'DS5'],
        'Volvo': ['V40', 'V60', 'V90', 'S40', 'S60', 'S90', 'XC40', 'XC60', 'XC90', 'C30', 'C40', 'V50', 'C70', 'S80', 'V70', 'XC70', 'Polestar'],
        'Fiat': ['500', 'Panda', 'Tipo', 'Punto', 'Doblo', 'Fiorino', 'Qubo', 'Talento', 'Ducato', '124 Spider', 'Abarth', 'Panda 4x4'],
        'Opel': ['Corsa', 'Astra', 'Insignia', 'Crossland', 'Mokka', 'Grandland', 'Combo', 'Vivaro', 'Movano', 'Zafira', 'Meriva', 'Adam', 'Ampera', 'GT'],
        'Skoda': ['Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq', 'Citigo', 'Roomster', 'Yeti', 'Rapid', 'Klement'],
        'Seat': ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco', 'Alhambra', 'Mii', 'Toledo', 'Altea', 'Exeo', 'Cupra'],
        'Mazda': ['2', '3', '6', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'CX-8', 'CX-9', 'MX-30', 'MX-5', 'RX-8', 'BT-50'],
        'Nissan': ['Micra', 'Note', 'Pulsar', 'Leaf', 'Qashqai', 'Juke', 'X-Trail', 'Pathfinder', 'Patrol', 'Navara', 'NV200', 'NV300', 'NV400', 'GT-R', '370Z', '400Z'],
        'Hyundai': ['i10', 'i20', 'i30', 'i40', 'Ioniq', 'Kona', 'Tucson', 'Santa Fe', 'Palisade', 'Veloster', 'Genesis', 'Nexo', 'iLoad', 'H-1', 'H-100'],
        'Kia': ['Picanto', 'Rio', 'Ceed', 'XCeed', 'Stonic', 'Niro', 'Sportage', 'Sorento', 'Carnival', 'Stinger', 'EV6', 'EV9', 'Soul', 'Venga', 'Opirus'],
        'Subaru': ['Impreza', 'XV', 'Forester', 'Outback', 'Legacy', 'WRX', 'WRX STI', 'BRZ', 'Levorg', 'Ascent', 'Crosstrek'],
        'Mitsubishi': ['Mirage', 'Space Star', 'Lancer', 'ASX', 'Eclipse Cross', 'Outlander', 'Pajero', 'L200', 'Fuso', 'i-MiEV'],
        'Suzuki': ['Swift', 'Ignis', 'Baleno', 'Celerio', 'SX4', 'Vitara', 'Jimny', 'Jimny Sierra', 'Carry', 'Every'],
        'Dacia': ['Sandero', 'Logan', 'Duster', 'Lodgy', 'Dokker', 'Spring', 'Bigster'],
        'Lada': ['Granta', 'Vesta', 'XRAY', 'Largus', 'Niva', '4x4'],
        'Tesla': ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck', 'Roadster', 'Semi'],
        'Porsche': ['911', '718 Boxster', '718 Cayman', 'Panamera', 'Macan', 'Cayenne', 'Taycan', '918 Spyder'],
        'Jaguar': ['XE', 'XF', 'XJ', 'E-PACE', 'F-PACE', 'I-PACE', 'F-TYPE', 'XKR', 'XFR'],
        'Land Rover': ['Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque', 'Defender'],
        'Mini': ['Cooper', 'Cooper S', 'John Cooper Works', 'Clubman', 'Countryman', 'Paceman', 'Convertible'],
        'Smart': ['Fortwo', 'Forfour', 'EQ Fortwo', 'EQ Forfour'],
        'Alfa Romeo': ['Giulia', 'Stelvio', 'Tonale', 'MiTo', 'Giulietta', '4C', '8C'],
        'Lancia': ['Ypsilon', 'Musa', 'Delta', 'Thema', 'Voyager', 'Stratos'],
        'Ferrari': ['488', 'F8', 'SF90', '296 GTB', '812 Superfast', 'Portofino', 'Roma', 'Daytona SP3'],
        'Lamborghini': ['Huracan', 'Aventador', 'Urus', 'Sian', 'Countach', 'Gallardo', 'Murcielago'],
        'Maserati': ['Ghibli', 'Quattroporte', 'Levante', 'MC20', 'GranTurismo', 'GranCabrio'],
        'Aston Martin': ['Vantage', 'DB11', 'DBS', 'Rapide', 'Vanquish', 'Valhalla', 'Valkyrie'],
        'Lotus': ['Elise', 'Exige', 'Evora', 'Emira', 'Evija', '3-Eleven'],
        'Bentley': ['Continental', 'Flying Spur', 'Bentayga', 'Mulsanne', 'Arnage'],
        'Rolls-Royce': ['Ghost', 'Phantom', 'Wraith', 'Dawn', 'Cullinan', 'Spectre'],
        'Maybach': ['S 580', 'S 680', 'GLS 600', '57', '62'],
        'McLaren': ['540C', '570S', '570GT', '600LT', '650S', '675LT', '720S', '765LT', 'Artura', 'P1', 'Speedtail', 'Elva'],
        'Bugatti': ['Chiron', 'Divo', 'Centodieci', 'La Voiture Noire', 'Veyron', 'EB110'],
        'Geely': ['Emgrand', 'Vision', 'Boyue', 'Binyue', 'Jiaji', 'Haoyue', 'Geometry'],
        'Tata': ['Tiago', 'Tigor', 'Altroz', 'Nexon', 'Harrier', 'Safari', 'Hexa', 'Bolt', 'Zest'],
        'Daewoo': ['Matiz', 'Nexia', 'Lanos', 'Leganza', 'Nubira', 'Tacuma', 'Kalos'],
        'SsangYong': ['Tivoli', 'Korando', 'Rexton', 'Actyon', 'Kyron', 'Rodius', 'Musso'],
        'Isuzu': ['D-Max', 'MU-X', 'Trooper', 'Rodeo', 'Gemini', 'Piazza', 'TF'],
        'Hummer': ['H1', 'H2', 'H3'],
        'Infiniti': ['Q30', 'Q50', 'Q60', 'Q70', 'QX30', 'QX50', 'QX60', 'QX70', 'QX80'],
        'Lexus': ['IS', 'ES', 'GS', 'LS', 'UX', 'NX', 'RX', 'GX', 'LX', 'RC', 'LC', 'SC', 'LFA'],
        'Acura': ['ILX', 'TLX', 'RLX', 'RDX', 'MDX', 'ZDX', 'NSX', 'Integra'],
        'Cadillac': ['CT4', 'CT5', 'CT6', 'Escalade', 'XT4', 'XT5', 'XT6', 'Lyriq', 'Celestiq'],
        'Lincoln': ['MKZ', 'Continental', 'Corsair', 'Nautilus', 'Aviator', 'Navigator'],
        'Chrysler': ['300', 'Pacifica', 'Voyager', 'Aspen', 'PT Cruiser', 'Sebring'],
        'Dodge': ['Charger', 'Challenger', 'Durango', 'Journey', 'Grand Caravan', 'Nitro', 'Caliber', 'Viper'],
        'Jeep': ['Wrangler', 'Cherokee', 'Grand Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Patriot'],
        'Ram': ['1500', '2500', '3500', 'ProMaster', 'Dakota'],
        'Buick': ['Encore', 'Envision', 'Enclave', 'Regal', 'LaCrosse', 'Verano', 'Cascada'],
        'GMC': ['Sierra', 'Canyon', 'Terrain', 'Acadia', 'Yukon', 'Savana', 'Envoy'],
        'Chevrolet': ['Spark', 'Sonic', 'Cruze', 'Malibu', 'Impala', 'Camaro', 'Corvette', 'Trax', 'Equinox', 'Blazer', 'Traverse', 'Tahoe', 'Suburban', 'Colorado', 'Silverado'],
        'Pontiac': ['G3', 'G5', 'G6', 'G8', 'Solstice', 'Torrent', 'Vibe'],
        'Saturn': ['Aura', 'Outlook', 'Sky', 'Vue', 'Ion'],
        'Oldsmobile': ['Alero', 'Intrigue', 'Silhouette', 'Bravada'],
        'Saab': ['9-3', '9-5', '9-7X', '900', '9000'],
        'Rover': ['75', '45', '25', 'CityRover', 'Streetwise'],
        'MG': ['3', '5', '6', 'GS', 'ZS', 'HS', 'TF', 'MGF'],
        'Rivian': ['R1T', 'R1S', 'EDV'],
        'Lucid': ['Air', 'Gravity'],
        'Fisker': ['Ocean', 'Karma', 'Emotion'],
        'Byton': ['M-Byte', 'K-Byte'],
        'NIO': ['ES8', 'ES6', 'EC6', 'ET7', 'ET5', 'EP9'],
        'XPeng': ['G3', 'P7', 'P5', 'G9'],
        'Li Auto': ['ONE', 'L9', 'L8', 'L7'],
        'Haval': ['H1', 'H2', 'H4', 'H6', 'H7', 'H8', 'H9', 'Jolion', 'Dargo'],
        'Chery': ['Arrizo', 'Tiggo', 'QQ', 'A1', 'A3', 'E3', 'Fulwin'],
        'BYD': ['Han', 'Tang', 'Song', 'Qin', 'Yuan', 'Dolphin', 'Seal', 'Atto 3'],
        'Great Wall': ['Poer', 'Wingle', 'Steed', 'Voleex', 'Florid'],
        'Changan': ['CS35', 'CS55', 'CS75', 'Eado', 'Alsvin', 'BenBen'],
        'Haima': ['2', '3', '7X', '8S', 'Family', 'Fstar'],
        'JAC': ['Refine', 'T6', 'T8', 'iEV', 'Yiwei'],
        'Lifan': ['X50', 'X60', 'Myway', '620', '520', '320'],
        'Brilliance': ['H330', 'H530', 'V3', 'V5', 'V7', 'M8'],
        'Dongfeng': ['Fengshen', 'Fengxing', 'Forthing', 'Aeolus', 'Venucia'],
        'Foton': ['Midi', 'View', 'Toano', 'Gratour', 'Sauvan'],
        'JMC': ['Yusheng', 'Vigus', 'Carry', 'Baodian'],
        'Maxus': ['D60', 'G50', 'G10', 'V80', 'T60', 'T70', 'T90'],
        'Roewe': ['RX3', 'RX5', 'RX8', 'i5', 'i6', 'MARVEL X'],
        'Trumpchi': ['GS3', 'GS4', 'GS5', 'GS7', 'GS8', 'GA4', 'GA6', 'GA8', 'GM6', 'GM8'],
        'Venucia': ['T60', 'T70', 'T90', 'D60', 'R30', 'R50', 'R60'],
        'Wey': ['VV5', 'VV6', 'VV7', 'Tank 300', 'Mocha', 'Latte', 'Macchiato'],
        'Zeekr': ['001', '009', 'X', '007'],
        'HiPhi': ['HiPhi X', 'HiPhi Z', 'HiPhi Y'],
        'Human Horizons': ['HiPhi X', 'HiPhi Z', 'HiPhi Y']
      }
      
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