import './deployment-trigger.js';
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import http from 'http'
import { applyDeploymentFix } from './deployment_fix.js'

// APLICĂ FIX DE DEPLOYMENT IMEDIAT
console.log('🚀 SERVER STARTUP - Container Debug Log - Deployment Fix')
applyDeploymentFix();
console.log('✅ Deployment fix aplicat cu succes');
console.log('📍 Current directory:', process.cwd())
if (!process.env.NODE_ENV && (process.env.RAILWAY_PROJECT_ID || process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_STATIC_URL)) {
  process.env.NODE_ENV = 'production'
}
console.log('🔧 NODE_ENV:', process.env.NODE_ENV)
console.log('📋 Process arguments:', process.argv)

// Handler pentru erori neașteptate
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message)
  console.error('Stack:', error.stack)
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1)
  } else {
    console.error('⚠️  Suppressing exit on uncaughtException in production to maintain liveness')
  }
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1)
  } else {
    console.error('⚠️  Suppressing exit on unhandledRejection in production to maintain liveness')
  }
})

// Startup state for healthcheck
let serverReady = false

// Timeout de siguranță pentru startup - mai lung pentru Railway
const startupTimeoutMs = process.env.RAILWAY_PROJECT_ID ? 120000 : 30000 // 2 minute pentru Railway
const startupTimeout = setTimeout(() => {
  console.error(`❌ Server startup timeout - server failed to start within ${startupTimeoutMs/1000} seconds`)
  process.exit(1)
}, startupTimeoutMs)

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
import adminServicesRouter from './routes/adminServices.js'
import cachedServicesRouter from './routes/cachedServices.js'
let GoogleSheetsService
let VehiclesAPIService
let vehicleServicesService
let initializeEmailService

const app = express()

// Ultra-early healthcheck endpoints - respond even during startup
// HEAD / for liveness probes without breaking frontend root
app.head('/', (req, res) => {
  res.sendStatus(200)
})
app.head('/', (req, res) => {
  res.sendStatus(200)
})

app.get('/ping', (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('📍 PING endpoint hit - server responding')
  }
  res.status(200).send('pong')
})
app.head('/ping', (req, res) => {
  res.sendStatus(200)
})

app.get('/health', (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('📍 HEALTH endpoint hit - server responding')
  }
  
  // Log healthcheck hits in production for debugging
  if (process.env.NODE_ENV === 'production') {
    console.log('🏥 Healthcheck received at:', new Date().toISOString())
  }
  
  // Simple text response for better compatibility with healthcheck systems
  res.status(200).send('OK')
})
app.head('/health', (req, res) => {
  res.sendStatus(200)
})

// Serve static files from React build if available (moved here for module compatibility)
const clientBuildPath = path.join(__dirname, '../../client/dist')
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath))
  console.log('✅ Serving static files from:', clientBuildPath)
}

// Serve uploaded files
const uploadsPath = path.join(__dirname, '../uploads')
if (fs.existsSync(uploadsPath)) {
  app.use('/uploads', express.static(uploadsPath))
}

// Readiness endpoint returns 200 only when services are marked ready
app.get('/ready', (req, res) => {
  const statusCode = serverReady ? 200 : 503
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📍 READY endpoint hit - serverReady=${serverReady}`)
  }
  res.status(statusCode).json({
    status: serverReady ? 'ready' : 'starting',
    serverReady,
    timestamp: new Date().toISOString()
  })
})

app.get('/debug', (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('📍 DEBUG endpoint hit - full system info')
  }
  res.json({
    status: 'debug_info',
    serverReady: serverReady,
    port: process.env.PORT || 8080,
    nodeEnv: process.env.NODE_ENV || 'development',
    railwayEnv: !!process.env.RAILWAY_PROJECT_ID,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Critical startup logging
console.log('🔥 CRITICAL: Express app created, healthcheck endpoints mounted')
console.log('🔥 CRITICAL: PORT from env:', process.env.PORT)
console.log('🔥 CRITICAL: NODE_ENV:', process.env.NODE_ENV)

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://spectra-autoart-production.up.railway.app',
    'https://spectra-autoart-production.up.railway.app:8080',
    process.env.CLIENT_ORIGIN,
    process.env.RAILWAY_STATIC_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires', 'X-Requested-With']
}))

// Handle CORS preflight for all routes
app.options('*', cors())

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Debug middleware to log all requests - MUST be before API routes
if (process.env.NODE_ENV !== 'production') {
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
}

app.use('/api/public', publicRouter)

// Deployment debugging log
console.log('🔍 SERVER DEBUG - Route debugging enabled');
console.log('🔍 Available admin routes will be logged on startup');

app.use('/api/admin', adminRouter)
app.use('/api/admin/services', adminServicesRouter)
app.use('/api/services/cached', cachedServicesRouter)
app.use('/api/vehicles', vehicleRouter)
app.use('/api/services', servicesRouter)
app.use('/api/vehicle-services', vehicleServicesRouter)
app.use('/api/bookings', bookingsRouter)

// CRITICAL: Adăugăm router de test pentru Google Sheets
try {
  const { default: testGoogleSheetsRouter } = await import('./routes/test-google-sheets.js')
  app.use('/api/test-sheets', testGoogleSheetsRouter)
  console.log('✅ Test Google Sheets routes mounted')
} catch (error) {
  console.log('⚠️  Test Google Sheets routes not available:', error.message)
}

app.use('/api/gallery', galleryRouter)
app.use('/api/testimonials', testimonialsRouter)
app.use('/api/translate', translateRouter)
// Removed debug routes
console.log('✅ API routes mounted')

// Catch-all route for React frontend - serve index.html for any non-API route
app.get('*', (req, res) => {
  const clientBuildPath = path.join(__dirname, '../../client/dist')
  const indexPath = path.join(clientBuildPath, 'index.html')
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).json({ 
      error: 'Frontend not found', 
      message: 'React build not found. Please ensure the client has been built.',
      path: indexPath
    })
  }
})

// Healthcheck endpoints are defined EARLIER in the file (right after app creation)
// This ensures they respond even during startup issues

// Healthcheck endpoints are already defined (debug, ping, health) right after app creation

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

// Force server to start - Railway needs direct server startup
const isModule = false // ALWAYS false for Railway deployment

// Start server immediately without waiting for services initialization
const startServer = async () => {
  // For Railway deployment, always start server
  if (process.env.RAILWAY_PROJECT_ID || process.env.PORT) {
    console.log('🏭 RAILWAY/PRODUCTION DETECTED: Starting server in production mode')
  }
  try {
    const port = process.env.PORT || 8080
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'

    console.log('🚀 STARTING SERVER - Railway Production Debug')
    console.log(`🎯 NODE_ENV: ${process.env.NODE_ENV}`)
    console.log(`🎯 PORT: ${port}`)
    console.log(`🎯 HOST: ${host}`)
    console.log(`🎯 Railway environment: ${!!process.env.RAILWAY_PROJECT_ID ? 'YES' : 'NO'}`)
    console.log('🔥 CRITICAL: About to call app.listen()')
    console.log('🔥 RAILWAY_DEBUG: Server starting with ultra-early endpoints already mounted')
    
    // Start server IMMEDIATELY - don't wait for services initialization
    console.log(`🔥 CRITICAL: Calling app.listen(${port}, ${host})`)
    console.log(`🔥 RAILWAY_DEBUG: Healthcheck endpoints should be available at:`)
    console.log(`🔥 RAILWAY_DEBUG: http://${host}:${port}/ping`)
    console.log(`🔥 RAILWAY_DEBUG: http://${host}:${port}/health`)
    console.log(`🔥 RAILWAY_DEBUG: http://${host}:${port}/debug`)
    
    const server = app.listen(port, () => {
      clearTimeout(startupTimeout) // Stop safety timeout
      serverReady = true // Mark server as ready for healthchecks
      console.log('🔥 RAILWAY_DEBUG: SERVER SUCCESSFULLY STARTED!')
      console.log(`🔥 RAILWAY_DEBUG: Listening on 0.0.0.0:${port}`)
      console.log(`✅ Server Spectra AutoArt STARTED SUCCESSFULLY on 0.0.0.0:${port}`)
      console.log(`🏥 Healthcheck available at: http://0.0.0.0:${port}/health`)
      console.log(`🏓 Ping healthcheck available at: http://0.0.0.0:${port}/ping`)
      console.log(`🔄 Server ready state: ${serverReady}`)
      
      // Test the healthcheck endpoints immediately
      setTimeout(() => {
        console.log('🔥 TESTING HEALTHCHECK ENDPOINTS:')
        console.log(`🔥 Testing: http://localhost:${port}/ping`)
        console.log(`🔥 Testing: http://localhost:${port}/health`)
        console.log(`🔥 Testing: http://localhost:${port}/debug`)
        
        // Actually test the health endpoint
        try {
          const options = {
            hostname: 'localhost',
            port: port,
            path: '/health',
            method: 'GET',
            timeout: 5000
          }
          
          const req = http.request(options, (res) => {
            console.log(`🔥 HEALTH TEST: Status ${res.statusCode}`)
            if (res.statusCode === 200) {
              console.log('✅ Health endpoint responding correctly')
            } else {
              console.log(`⚠️ Health endpoint returned ${res.statusCode}`)
            }
          })
          
          req.on('error', (err) => {
            console.log(`❌ Health endpoint test failed: ${err.message}`)
          })
          
          req.on('timeout', () => {
            console.log('❌ Health endpoint test timeout')
            req.destroy()
          })
          
          req.end()
        } catch (testError) {
          console.log(`❌ Health endpoint test error: ${testError.message}`)
        }
      }, 1000)
      
      // Routes and static files already mounted before server starts

      // Services are now initialized before server starts
      console.log('✅ Server fully ready with all services initialized')
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

// Initialize services before starting server
async function initializeAndStartServer() {
  try {
    console.log('🔄 Initializing services before server startup...')
    await initializeServices()
    console.log('✅ Services initialized successfully, starting server...')
    await startServer()
  } catch (error) {
    console.error('❌ Failed to initialize services or start server:', error.message)
    process.exit(1)
  }
}

// Start the server immediately
console.log('🚀 STARTING SERVER - Production mode')
initializeAndStartServer()

// Export the Express app for use by h.js healthcheck server
export default app;
