import GoogleSheetsService from '../server/src/services/googleSheetsService.js'
import { translateMultipleWithCache } from '../server/src/services/translationCacheService.js'

// Datele de fallback din vehicles.js
const fallbackModels = {
  'Acura': ['ILX', 'MDX', 'NSX', 'RDX', 'RLX', 'TLX'],
  'Alfa Romeo': ['Giulia', 'Stelvio', '4C', 'Giulietta', 'Mito'],
  'Aston Martin': ['DB11', 'DBS', 'Rapide', 'Vantage', 'Vanquish'],
  'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q4', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron', 'e-tron GT', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'SQ5', 'SQ7', 'SQ8'],
  'Bentley': ['Bentayga', 'Continental', 'Flying Spur', 'Mulsanne'],
  'BMW': ['Seria 1', 'Seria 2', 'Seria 3', 'Seria 4', 'Seria 5', 'Seria 6', 'Seria 7', 'Seria 8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'iX', 'M2', 'M3', 'M4', 'M5', 'X5 M', 'X6 M'],
  'Bugatti': ['Chiron', 'Veyron'],
  'Buick': ['Encore', 'Enclave', 'Envision', 'LaCrosse', 'Regal'],
  'Cadillac': ['ATS', 'CT4', 'CT5', 'CT6', 'CTS', 'Escalade', 'XT4', 'XT5', 'XT6'],
  'Chery': ['Arrizo', 'Tiggo', 'QQ'],
  'Chevrolet': ['Aveo', 'Beat', 'Blazer', 'Bolt', 'Camaro', 'Caprice', 'Captiva', 'Cavalier', 'Cobalt', 'Colorado', 'Corvette', 'Cruze', 'Equinox', 'Express', 'Impala', 'Malibu', 'Monte Carlo', 'Onix', 'Orlando', 'Prisma', 'S10', 'Silverado', 'Sonic', 'Spark', 'Spin', 'Suburban', 'Tahoe', 'Tracker', 'TrailBlazer', 'Traverse', 'Trax', 'Vectra', 'Volt'],
  'Chrysler': ['200', '300', 'Pacifica', 'PT Cruiser', 'Sebring', 'Town & Country', 'Voyager'],
  'Citroen': ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'Berlingo', 'Cactus', 'DS3', 'DS4', 'DS5', 'Jumper', 'Jumpy', 'Nemo', 'Saxo', 'Xantia', 'Xsara'],
  'Dacia': ['Dokker', 'Duster', 'Lodgy', 'Logan', 'Sandero', 'Spring'],
  'Daewoo': ['Kalos', 'Lacetti', 'Lanos', 'Leganza', 'Matiz', 'Nubira', 'Tacuma'],
  'Daihatsu': ['Charade', 'Copen', 'Cuore', 'Materia', 'Move', 'Sirion', 'Terios'],
  'Dodge': ['Attitude', 'Avenger', 'Caliber', 'Caravan', 'Challenger', 'Charger', 'Dart', 'Durango', 'Grand Caravan', 'Journey', 'Magnum', 'Neon', 'Nitro', 'Ram', 'Stealth', 'Stratus', 'Viper'],
  'Ferrari': ['296 GTB', '458', '488', '812', 'F12', 'F40', 'F50', 'Enzo', 'LaFerrari', 'Portofino', 'Roma', 'SF90'],
  'Fiat': ['500', '500L', '500X', 'Argo', 'Bravo', 'Cronos', 'Doblo', 'Fiorino', 'Grande Punto', 'Idea', 'Linea', 'Mobi', 'Palio', 'Panda', 'Punto', 'Qubo', 'Siena', 'Stilo', 'Strada', 'Tipo', 'Uno'],
  'Ford': ['Bronco', 'C-Max', 'Courier', 'Ecosport', 'Edge', 'Escape', 'Escort', 'Excursion', 'Expedition', 'Explorer', 'F-150', 'F-250', 'F-350', 'Fiesta', 'Flex', 'Focus', 'Fusion', 'Galaxy', 'Ka', 'Kuga', 'Maverick', 'Mondeo', 'Mustang', 'Orion', 'Puma', 'Ranger', 'S-Max', 'Taurus', 'Thunderbird', 'Tourneo', 'Transit', 'Windstar'],
  'Geely': ['CK', 'Emgrand', 'GC6', 'Panda'],
  'Genesis': ['G70', 'G80', 'G90', 'GV60', 'GV70', 'GV80'],
  'GMC': ['Acadia', 'Canyon', 'Savana', 'Sierra', 'Terrain', 'Yukon'],
  'Great Wall': ['Haval', 'Steed', 'Voleex'],
  'Honda': ['Accord', 'City', 'Civic', 'Clarity', 'CR-V', 'CR-Z', 'Element', 'Fit', 'HR-V', 'Insight', 'Jazz', 'Odyssey', 'Passport', 'Pilot', 'Prelude', 'Ridgeline', 'S2000'],
  'Hummer': ['H1', 'H2', 'H3'],
  'Hyundai': ['Accent', 'Atos', 'Azera', 'Creta', 'Elantra', 'Equus', 'Genesis', 'Getz', 'Grand i10', 'Grand Santa Fe', 'H1', 'i10', 'i20', 'i30', 'i40', 'Ioniq', 'ix20', 'ix35', 'ix55', 'Kona', 'Maxcruz', 'Palisade', 'Santa Fe', 'Sonata', 'Tucson', 'Veloster', 'Venue'],
  'Infiniti': ['EX', 'FX', 'G', 'JX', 'M', 'Q30', 'Q40', 'Q50', 'Q60', 'Q70', 'QX30', 'QX50', 'QX56', 'QX60', 'QX70', 'QX80'],
  'Isuzu': ['D-Max', 'MU-X', 'Trooper'],
  'Iveco': ['Daily'],
  'Jaguar': ['E-Pace', 'F-Pace', 'F-Type', 'I-Pace', 'S-Type', 'X-Type', 'XE', 'XF', 'XJ', 'XJR', 'XK', 'XKR'],
  'Jeep': ['Cherokee', 'Commander', 'Compass', 'Gladiator', 'Grand Cherokee', 'Liberty', 'Patriot', 'Renegade', 'Wagoneer', 'Wrangler'],
  'Kia': ['Carens', 'Carnival', 'Ceed', 'Cerato', 'Forte', 'K5', 'K900', 'Mohave', 'Niro', 'Optima', 'Picanto', 'Rio', 'Seltos', 'Sorento', 'Soul', 'Sportage', 'Stinger', 'Telluride', 'Venga'],
  'Koenigsegg': ['Agera', 'CCX', 'Jesko', 'Regera'],
  'Lada': ['Granta', 'Kalina', 'Niva', 'Priora', 'Vesta', 'XRay'],
  'Lamborghini': ['Aventador', 'Countach', 'Diablo', 'Gallardo', 'Huracan', 'Murcielago', 'Reventon', 'Sian', 'Urus'],
  'Lancia': ['Delta', 'Musa', 'Phedra', 'Thema', 'Voyager', 'Ypsilon'],
  'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Freelander', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'],
  'Lexus': ['CT', 'ES', 'GS', 'GX', 'HS', 'IS', 'LC', 'LS', 'LX', 'NX', 'RC', 'RX', 'SC', 'UX'],
  'Lincoln': ['Aviator', 'Continental', 'Corsair', 'MKC', 'MKS', 'MKT', 'MKX', 'MKZ', 'Nautilus', 'Navigator', 'Town Car', 'Zephyr'],
  'Lotus': ['Elan', 'Elise', 'Esprit', 'Evora', 'Exige'],
  'Maserati': ['Ghibli', 'GranTurismo', 'Levante', 'Quattroporte'],
  'Maybach': ['57', '62', 'S-Class'],
  'Mazda': ['2', '3', '5', '6', 'BT-50', 'CX-3', 'CX-30', 'CX-4', 'CX-5', 'CX-7', 'CX-8', 'CX-9', 'Demio', 'MX-5', 'Premacy', 'RX-7', 'RX-8'],
  'McLaren': ['570S', '600LT', '650S', '720S', 'Artura', 'GT', 'P1', 'Senna'],
  'Mercedes-Benz': ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class', 'SL', 'SLC', 'AMG GT', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'C 63 AMG', 'E 63 AMG', 'S 63 AMG', 'G 63 AMG'],
  'MG': ['3', '5', '6', 'GS', 'HS', 'ZS'],
  'Mini': ['Clubman', 'Convertible', 'Countryman', 'Coupe', 'Paceman', 'Roadster'],
  'Mitsubishi': ['ASX', 'Carisma', 'Colt', 'Eclipse', 'Eclipse Cross', 'Galant', 'Grandis', 'L200', 'Lancer', 'Mirage', 'Montero', 'Outlander', 'Pajero', 'Space Star'],
  'Nissan': ['370Z', 'Almera', 'Altima', 'Armada', 'Ariya', 'Bluebird', 'Cabstar', 'Cube', 'Dualis', 'Elgrand', 'Evalia', 'Frontier', 'GT-R', 'Interstar', 'Juke', 'Kicks', 'Leaf', 'Maxima', 'Micra', 'Murano', 'Navara', 'Note', 'NV200', 'Pathfinder', 'Patrol', 'Primastar', 'Primera', 'Pulsar', 'Qashqai', 'Quest', 'Rogue', 'Sentra', 'Serena', 'Sunny', 'Teana', 'Terrano', 'Tiida', 'Titan', 'Townstar', 'Tucson', 'Vanette', 'Versa', 'X-Trail', 'Xterra'],
  'Opel': ['Adam', 'Agila', 'Ampera', 'Antara', 'Astra', 'Calibra', 'Cascada', 'Combo', 'Corsa', 'Crossland', 'Frontera', 'Grandland', 'GT', 'Insignia', 'Kadett', 'Meriva', 'Mokka', 'Monterey', 'Omega', 'Signum', 'Sintra', 'Speedster', 'Tigra', 'Vectra', 'Vivaro', 'Zafira'],
  'Peugeot': ['106', '107', '108', '2008', '205', '206', '207', '208', '3008', '306', '307', '308', '4007', '4008', '405', '406', '407', '5008', '508', '605', '607', '806', '807', 'Bipper', 'Boxer', 'Expert', 'iOn', 'Partner', 'RCZ'],
  'Pontiac': ['Aztek', 'Bonneville', 'Firebird', 'G3', 'G4', 'G5', 'G6', 'G8', 'Grand Am', 'Grand Prix', 'GTO', 'Montana', 'Solstice', 'Sunfire', 'Torrent', 'Trans Sport', 'Vibe'],
  'Porsche': ['718', '911', '918', '928', '944', '968', 'Boxster', 'Carrera GT', 'Cayenne', 'Cayman', 'Macan', 'Panamera', 'Taycan'],
  'RAM': ['1500', '2500', '3500', 'ProMaster'],
  'Renault': ['Alaskan', 'Arkana', 'Captur', 'Clio', 'Espace', 'Express', 'Fluence', 'Grand Scenic', 'Kadjar', 'Kangoo', 'Koleos', 'Laguna', 'Master', 'Megane', 'Modus', 'Rapid', 'Safrane', 'Scenic', 'Symbol', 'Talisman', 'Trafic', 'Twingo', 'Twizy', 'Wind', 'Zoe'],
  'Rolls-Royce': ['Cullinan', 'Dawn', 'Ghost', 'Phantom', 'Wraith'],
  'Rover': ['200', '25', '400', '45', '600', '75', '800', 'Metro', 'Mini', 'Montego'],
  'Saab': ['9-2X', '9-3', '9-4X', '9-5', '9-7X', '900', '9000'],
  'Seat': ['Alhambra', 'Altea', 'Arona', 'Arosa', 'Cordoba', 'Exeo', 'Ibiza', 'Leon', 'Mii', 'Tarraco', 'Toledo'],
  'Skoda': ['Citigo', 'Enyaq', 'Fabia', 'Favorit', 'Felicia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Rapid', 'Roomster', 'Scala', 'Superb', 'Yeti'],
  'Smart': ['EQ Forfour', 'EQ Fortwo', 'Forfour', 'Fortwo', 'Roadster'],
  'SsangYong': ['Actyon', 'Korando', 'Kyron', 'Musso', 'Rexton', 'Rodius', 'Tivoli', 'XLV'],
  'Subaru': ['Ascent', 'Baja', 'BRZ', 'Crosstrek', 'Exiga', 'Forester', 'Impreza', 'Justy', 'Legacy', 'Levorg', 'Outback', 'SVX', 'Tribeca', 'WRX', 'XV'],
  'Suzuki': ['Alto', 'Baleno', 'Celerio', 'Grand Vitara', 'Ignis', 'Jimny', 'Kizashi', 'Liana', 'Samurai', 'Splash', 'Swift', 'SX4', 'Vitara', 'Wagon R+'],
  'Tata': ['Indica', 'Indigo', 'Nano', 'Safari', 'Tiago', 'Tigor'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Roadster', 'Cybertruck'],
  'Toyota': ['4Runner', 'Auris', 'Avalon', 'Avanza', 'C-HR', 'Camry', 'Celica', 'Corolla', 'Cressida', 'Crown', 'Echo', 'FJ Cruiser', 'Fortuner', 'GT86', 'Hiace', 'Highlander', 'Hilux', 'Innova', 'Land Cruiser', 'Matrix', 'Mirai', 'Paseo', 'Pickup', 'Prado', 'Previa', 'Prius', 'Proace', 'RAV4', 'Sequoia', 'Sienna', 'Solara', 'Starlet', 'Supra', 'Tacoma', 'Tercel', 'Tundra', 'Venza', 'Verso', 'Vios', 'Yaris'],
  'Volkswagen': ['Amarok', 'Arteon', 'Beetle', 'Bora', 'Caddy', 'California', 'Caravelle', 'CC', 'Corrado', 'Crafter', 'Eos', 'Golf', 'ID.3', 'ID.4', 'ID.5', 'Jetta', 'LT', 'Multivan', 'New Beetle', 'Passat', 'Phaeton', 'Polo', 'Routan', 'Scirocco', 'Sharan', 'T-Cross', 'T-Roc', 'Tiguan', 'Touareg', 'Touran', 'Transporter', 'up!', 'Vento'],
  'Volvo': ['C30', 'C40', 'C70', 'S40', 'S60', 'S70', 'S80', 'S90', 'V40', 'V50', 'V60', 'V70', 'V90', 'XC40', 'XC60', 'XC70', 'XC90'],
  'Wiesmann': ['GT', 'MF3', 'MF4', 'MF5']
}

// Funcție pentru a genera ID unic
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Funcție pentru a traduce text în bulk
async function translateInBulk(texts, targetLanguages) {
  const results = {}
  
  for (const lang of targetLanguages) {
    try {
      const translations = await translateMultipleWithCache(texts, 'en', lang)
      results[lang] = translations
    } catch (error) {
      console.error(`Eroare la traducerea în ${lang}:`, error)
      // Folosim textele originale ca fallback
      results[lang] = texts
    }
  }
  
  return results
}

// Funcție principală pentru a popula Google Sheets
async function populateVehiclesSheet() {
  try {
    console.log('Încep procesarea datelor vehicule...')
    
    const targetLanguages = ['nl', 'en', 'es', 'pl', 'ro']
    const allMakes = Object.keys(fallbackModels)
    
    console.log(`Găsite ${allMakes.length} mărci și aproximativ ${Object.values(fallbackModels).flat().length} modele`)
    
    // Traducem toate mărcile
    console.log('Traduc mărcile...')
    const translatedMakes = await translateInBulk(allMakes, targetLanguages)
    
    // Traducem toate modelele
    console.log('Traduc modelele...')
    const allModels = Object.values(fallbackModels).flat()
    const translatedModels = await translateInBulk(allModels, targetLanguages)
    
    // Tipuri și caroserii standard
    const types = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Van', 'Minivan', 'Roadster']
    const bodies = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Van', 'Minivan', 'Roadster']
    
    console.log('Traduc tipurile...')
    const translatedTypes = await translateInBulk(types, targetLanguages)
    
    console.log('Traduc caroseriile...')
    const translatedBodies = await translateInBulk(bodies, targetLanguages)
    
    // Pregătim datele pentru Google Sheets
    const sheetData = []
    let rowCount = 0
    
    for (const [make, models] of Object.entries(fallbackModels)) {
      for (const model of models) {
        const now = new Date().toISOString()
        const row = [
          generateId(), // ID
          translatedMakes.nl[allMakes.indexOf(make)] || make, // Make_NL
          translatedMakes.en[allMakes.indexOf(make)] || make, // Make_EN
          translatedMakes.es[allMakes.indexOf(make)] || make, // Make_ES
          translatedMakes.pl[allMakes.indexOf(make)] || make, // Make_PL
          translatedMakes.ro[allMakes.indexOf(make)] || make, // Make_RO
          translatedModels.nl[allModels.indexOf(model)] || model, // Model_NL
          translatedModels.en[allModels.indexOf(model)] || model, // Model_EN
          translatedModels.es[allModels.indexOf(model)] || model, // Model_ES
          translatedModels.pl[allModels.indexOf(model)] || model, // Model_PL
          translatedModels.ro[allModels.indexOf(model)] || model, // Model_RO
          translatedTypes.nl[0], // Type_NL (Sedan)
          translatedTypes.en[0], // Type_EN (Sedan)
          translatedTypes.es[0], // Type_ES (Sedan)
          translatedTypes.pl[0], // Type_PL (Sedan)
          translatedTypes.ro[0], // Type_RO (Sedan)
          translatedBodies.nl[0], // Body_NL (Sedan)
          translatedBodies.en[0], // Body_EN (Sedan)
          translatedBodies.es[0], // Body_ES (Sedan)
          translatedBodies.pl[0], // Body_PL (Sedan)
          translatedBodies.ro[0], // Body_RO (Sedan)
          'true', // Active
          now, // Created_Date
          now  // Updated_Date
        ]
        
        sheetData.push(row)
        rowCount++
        
        // Adăugăm în loturi de 50 pentru a nu depăși limitele API
        if (sheetData.length >= 50) {
          console.log(`Adaug ${sheetData.length} rânduri în Google Sheets...`)
          await GoogleSheetsService.appendData('Vehicles', sheetData)
          sheetData.length = 0 // Golim array-ul
        }
      }
    }
    
    // Adăugăm și restul datelor
    if (sheetData.length > 0) {
      console.log(`Adaug ultimele ${sheetData.length} rânduri în Google Sheets...`)
      await GoogleSheetsService.appendData('Vehicles', sheetData)
    }
    
    console.log(`✅ Finalizat! Au fost adăugate ${rowCount} vehicule în Google Sheets.`)
    
  } catch (error) {
    console.error('Eroare la popularea Google Sheets:', error)
    throw error
  }
}

// Executăm scriptul
populateVehiclesSheet()
  .then(() => {
    console.log('Script finalizat cu succes!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script eșuat:', error)
    process.exit(1)
  })