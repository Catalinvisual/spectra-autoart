import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// LOG STARTUP DETALIAT PENTRU DEBUGGING CONTAINER
console.log('🚀 SERVER STARTUP - Container Debug Log - Deployment Fix')
console.log('📍 Current directory:', process.cwd())
console.log('🔧 NODE_ENV:', process.env.NODE_ENV)
console.log('📋 Process arguments:', process.argv)

// Handler pentru erori neașteptate
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message)
  console.error('Stack:', error.stack)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Timeout de siguranță pentru startup
const startupTimeout = setTimeout(() => {
  console.error('❌ Server startup timeout - server failed to start within 30 seconds')
  process.exit(1)
}, 30000)

// Configurare dotenv să încarce fișierul .env.local din directorul server
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envLocalPath = path.join(__dirname, '..', '.env.local')
const envPath = path.join(__dirname, '..', '.env')
const envProductionPath = path.join(__dirname, '..', '.env.production')

console.log('📂 __dirname:', __dirname)
console.log('🎯 __filename:', __filename)

try {
  const isProduction = process.env.NODE_ENV === 'production'
  const primaryPath = isProduction ? envProductionPath : envLocalPath
  const secondaryPath = isProduction ? envLocalPath : envProductionPath

  const primaryResult = dotenv.config({ path: primaryPath })
  if (primaryResult.error) {
    console.log('⚠️  Fișierul primar de env nu a putut fi încărcat, încerc fallback:', primaryResult.error.message)
    const secondaryResult = dotenv.config({ path: secondaryPath })
    if (secondaryResult.error) {
      console.log('⚠️  Fișierul secundar de env nu a putut fi încărcat, încerc .env:', secondaryResult.error.message)
      const fallbackResult = dotenv.config({ path: envPath })
      if (fallbackResult.error) {
        console.log('⚠️  Nici fișierul .env nu a putut fi încărcat, dar serverul va continua:', fallbackResult.error.message)
      } else {
        console.log('✅ Fișierul .env a fost încărcat cu succes (fallback)')
      }
    } else {
      console.log('✅ Fișierul secundar de env a fost încărcat cu succes')
    }
  } else {
    console.log('✅ Fișierul primar de env a fost încărcat cu succes')
  }
} catch (error) {
  console.log('⚠️  Eroare la încărcarea fișierului de configurare, dar serverul va continua:', error.message)
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
import adminServicesRouter from './routes/adminServices.js'
import cachedServicesRouter from './routes/cachedServices.js'
let GoogleSheetsService
let VehiclesAPIService
let vehicleServicesService
let initializeEmailService

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
app.use('/api/admin/services', adminServicesRouter)
app.use('/api/services/cached', cachedServicesRouter)
app.use('/api/vehicles', vehicleRouter)
app.use('/api/services', servicesRouter)
app.use('/api/vehicle-services', vehicleServicesRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/gallery', galleryRouter)
app.use('/api/testimonials', testimonialsRouter)
app.use('/api/translate', translateRouter)
app.use('/api/debug', debugVehiclesRouter)
console.log('✅ API routes mounted')

// API health check - must be before static files and catch-all route
app.get('/health', (req, res) => {
  // Health check rapid - răspunde imediat fără dependențe externe
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080
  })
})

// Mirror health check for Docker/Railway configs expecting /api/health
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080
  })
})

// Healthcheck ultra-simplu pentru Docker
app.get('/ping', (req, res) => {
  res.status(200).send('pong')
})

// Static and catch-all are mounted after API routes inside start callback

// Initialize Google Sheets Service
async function initializeServices() {
  try {
    if (!initializeEmailService) {
      ({ initializeEmailService } = await import('./services/emailService.js'))
    }
    const emailServiceInitialized = await initializeEmailService();
    if (emailServiceInitialized) {
      console.log('✅ Email service initialized successfully');
    } else {
      console.log('⚠️  Email service initialization failed - emails may not be sent');
    }
    
    if (!VehiclesAPIService) {
      VehiclesAPIService = (await import('./services/vehiclesAPIService.js')).default
    }
    const vehiclesAPIInitialized = await VehiclesAPIService.initialize();
    if (vehiclesAPIInitialized) {
      console.log('✅ Vehicles API service initialized successfully');
    } else {
      console.log('⚠️  Vehicles API not configured - using comprehensive demo data');
    }
    
    if (!GoogleSheetsService) {
      GoogleSheetsService = (await import('./services/googleSheetsService.js')).default
    }
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

    if (!vehicleServicesService) {
      ({ vehicleServicesService } = await import('./services/vehicleServicesService.js'))
    }
    // Initialize Vehicle Services
    try {
      const canUseSheets = (
        process.env.NODE_ENV === 'production' &&
        sheetsInitialized &&
        GoogleSheetsService &&
        GoogleSheetsService.isInitialized &&
        !GoogleSheetsService.isDemoMode
      )

      if (canUseSheets) {
        console.log('📥 Loading vehicle services from Google Sheets in production...')
        const loadedFromSheets = await vehicleServicesService.loadFromGoogleSheets()
        if (loadedFromSheets) {
          console.log('✅ Vehicle services loaded from Google Sheets in production')
          console.log(`📋 ${vehicleServicesService.services?.length || 0} services loaded`)
          console.log(`💰 ${vehicleServicesService.servicePrices?.length || 0} price configurations loaded`)
        } else {
          console.log('⚠️  Failed to load vehicle services from Google Sheets, initializing demo data')
          const demoData = await vehicleServicesService.initializeDemoData()
          console.log('✅ Vehicle services demo data initialized')
          console.log(`📋 ${demoData?.services || 0} services created`)
          console.log(`💰 ${demoData?.prices || 0} price configurations created`)
        }
      } else {
        const demoData = await vehicleServicesService.initializeDemoData()
        console.log('✅ Vehicle services demo data initialized')
        console.log(`📋 ${demoData?.services || 0} services created`)
        console.log(`💰 ${demoData?.prices || 0} price configurations created`)
      }
    } catch (error) {
      console.log('⚠️  Vehicle services initialization failed:', error.message);
    }
  } catch (error) {
    console.error('❌ Failed to initialize services:', error.message);
  }
}

// Start server immediately without waiting for services initialization
const startServer = async () => {
  try {
    const port = process.env.PORT || 8080
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'

    console.log(`🎯 Starting server on ${host}:${port}`)
    
    // Start server IMMEDIATELY - don't wait for services initialization
    const server = app.listen(port, host, () => {
      clearTimeout(startupTimeout) // Stop safety timeout
      console.log(`✅ Server Spectra AutoArt STARTED SUCCESSFULLY on ${host}:${port}`)
      console.log(`🏥 Healthcheck available at: http://${host}:${port}/health`)
      console.log(`🏓 Ping healthcheck available at: http://${host}:${port}/ping`)
      
      // Routes already mounted before static files

      // Serve uploaded files
      const uploadsPath = path.join(__dirname, '../uploads')
      app.use('/uploads', express.static(uploadsPath))

      // Serve static files from React build
      const clientBuildPath = path.join(__dirname, '../../client/dist')
      app.use(express.static(clientBuildPath))

      app.get('/site.webmanifest', (req, res) => {
        res.set('Content-Type', 'application/manifest+json')
        const manifestPath = path.join(clientBuildPath, 'site.webmanifest')
        if (fs.existsSync(manifestPath)) {
          res.sendFile(manifestPath)
        } else {
          res.send(JSON.stringify({
            name: 'Spectra AutoArt',
            short_name: 'Spectra AutoArt',
            icons: [],
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            start_url: '/',
            scope: '/'
          }))
        }
      })

      // Handle React routing, return all requests to React app
      app.get('*', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'index.html'))
      })

      // Initialize services in BACKGROUND after server starts
      setTimeout(() => {
        initializeServices().catch(error => {
          console.error('❌ Failed to initialize services:', error.message)
        })
      }, 100)
    })
    
    server.on('error', (error) => {
      console.error('❌ Server startup error:', error.message)
      process.exit(1)
    })
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR during server startup:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

// Start the server immediately
startServer()
