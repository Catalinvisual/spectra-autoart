import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

// Configurare dotenv să încarce fișierul .env din directorul server
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.join(__dirname, '..', '.env')

// Încearcă să încarce fișierul .env, dar nu opri serverul dacă lipsește
try {
  const result = dotenv.config({ path: envPath })
  if (result.error) {
    console.log('⚠️  Fișierul .env nu a putut fi încărcat, dar serverul va continua:', result.error.message)
  } else {
    console.log('✅ Fișierul .env a fost încărcat cu succes')
  }
} catch (error) {
  console.log('⚠️  Eroare la încărcarea fișierului .env, dar serverul va continua:', error.message)
}

// Fallback-uri pentru variabile critice
if (!process.env.PORT) {
  process.env.PORT = '8080'
  console.log('⚠️  PORT nu este setat, se folosește valoarea implicită: 8080')
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'fallback-jwt-secret-key-for-development'
  console.log('⚠️  JWT_SECRET nu este setat, se folosește valoarea implicită (NU folosi în producție!)')
}
if (!process.env.CLIENT_ORIGIN) {
  process.env.CLIENT_ORIGIN = 'https://spectra-autoart-production.up.railway.app'
  console.log('⚠️  CLIENT_ORIGIN nu este setat, se folosește valoarea implicită:', process.env.CLIENT_ORIGIN)
}

// Debug logging pentru verificare variabile Google Sheets
console.log('🔍 Server index.js - Verificare încărcare variabile din dotenv:')
console.log('📁 .env path:', envPath)
console.log('📊 GOOGLE_SHEETS_SPREADSHEET_ID:', process.env.GOOGLE_SHEETS_SPREADSHEET_ID)
console.log('📧 GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
console.log('🔑 GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY)
console.log('🔑 GOOGLE_PRIVATE_KEY length:', process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.length : 'undefined')
console.log('🔑 DEEPL_KEY exists:', !!process.env.DEEPL_KEY)
console.log('🔑 DEEPL_KEY format:', process.env.DEEPL_KEY ? process.env.DEEPL_KEY.substring(0, 8) + '...' + process.env.DEEPL_KEY.slice(-4) : 'undefined')

import publicRouter from './routes/public.js'
import adminRouter from './routes/admin.js'
import vehicleRouter from './routes/vehicles.js'
import servicesRouter from './routes/services.js'
import vehicleServicesRouter from './routes/vehicleServices.js'
import bookingsRouter from './routes/bookings.js'
import galleryRouter from './routes/gallery.js'
import testimonialsRouter from './routes/testimonials.js'
import translateRouter from './routes/translate.js'
import debugVehiclesRouter from './routes/debugVehicles.js'
import GoogleSheetsService from './services/googleSheetsService.js'
import VehiclesAPIService from './services/vehiclesAPIService.js'
import { vehicleServicesService } from './services/vehicleServicesService.js'

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://spectra-autoart-production.up.railway.app',
    'https://spectra-autoart-production.up.railway.app:8080',
    process.env.CLIENT_ORIGIN
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires', 'X-Requested-With']
}))

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Debug middleware to log all requests - MUST be before API routes
app.use((req, res, next) => {
  console.log('🌐 Server received request:', {
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    headers: req.headers
  })
  next()
})

app.use('/api/public', publicRouter)
app.use('/api/admin', adminRouter)
app.use('/api/vehicles', vehicleRouter)
app.use('/api/services', servicesRouter)
app.use('/api/vehicle-services', vehicleServicesRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/gallery', galleryRouter)
app.use('/api/testimonials', testimonialsRouter)
app.use('/api/translate', translateRouter)
app.use('/api/debug', debugVehiclesRouter)

// API health check - must be before static files and catch-all route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve static files from React build
const clientBuildPath = path.join(__dirname, '../../client/dist')
app.use(express.static(clientBuildPath))

// Handle React routing, return all requests to React app
// This should be the LAST route to catch any unmatched requests
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'))
})

// Initialize Google Sheets Service
async function initializeServices() {
  try {
    // Initialize Vehicles API Service
    const vehiclesAPIInitialized = await VehiclesAPIService.initialize();
    if (vehiclesAPIInitialized) {
      console.log('✅ Vehicles API service initialized successfully');
    } else {
      console.log('⚠️  Vehicles API not configured - using comprehensive demo data');
    }
    
    // Initialize Google Sheets Service
    const sheetsInitialized = await GoogleSheetsService.initialize();
    if (sheetsInitialized) {
      console.log('✅ Google Sheets service initialized successfully');
      
      // Create spreadsheet structure if configured
      if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        try {
          const spreadsheetId = await GoogleSheetsService.createSpreadsheetStructure();
          console.log(`📊 Google Sheets structure created: ${spreadsheetId}`);
        } catch (error) {
          console.log('⚠️  Google Sheets structure may already exist or creation failed');
        }
      }
    } else {
      console.log('⚠️  Google Sheets not configured - using demo data');
    }

    // Initialize Vehicle Services
    try {
      if (process.env.NODE_ENV === 'production' && sheetsInitialized) {
        // In production with Google Sheets configured, load services from Google Sheets
        console.log('📥 Loading vehicle services from Google Sheets in production...');
        const loadedFromSheets = await vehicleServicesService.loadFromGoogleSheets();
        if (loadedFromSheets) {
          console.log('✅ Vehicle services loaded from Google Sheets in production');
          console.log(`📋 ${vehicleServicesService.services?.length || 0} services loaded`);
          console.log(`💰 ${vehicleServicesService.servicePrices?.length || 0} price configurations loaded`);
        } else {
          console.log('⚠️  Failed to load vehicle services from Google Sheets, using fallback');
        }
      } else if (process.env.NODE_ENV !== 'production') {
        // Only initialize demo data in development
        const demoData = await vehicleServicesService.initializeDemoData();
        console.log('✅ Vehicle services demo data initialized');
        console.log(`📋 ${demoData?.services || 0} services created`);
        console.log(`💰 ${demoData?.prices || 0} price configurations created`);
      }
    } catch (error) {
      console.log('⚠️  Vehicle services initialization failed:', error.message);
    }
  } catch (error) {
    console.error('❌ Failed to initialize services:', error.message);
  }
}

const port = process.env.PORT || 8080
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'
app.listen(port, host, async () => {
  console.log(`🚀 Server Spectra AutoArt rulează pe ${host}:${port}`)
  // Initialize services after server starts to avoid blocking - use very short delay for Railway
  setTimeout(() => {
    initializeServices().catch(error => {
      console.error('❌ Failed to initialize services:', error.message)
    })
  }, 100)
})