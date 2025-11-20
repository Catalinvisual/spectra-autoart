import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import publicRouter from './routes/public.js'
import adminRouter from './routes/admin.js'
import vehicleRouter from './routes/vehicles.js'
import servicesRouter from './routes/services.js'
import vehicleServicesRouter from './routes/vehicleServices.js'
import bookingsRouter from './routes/bookings.js'
import galleryRouter from './routes/gallery.js'
import testimonialsRouter from './routes/testimonials.js'
import translateRouter from './routes/translate.js'
import GoogleSheetsService from './services/googleSheetsService.js'
import VehiclesAPIService from './services/vehiclesAPIService.js'
import { vehicleServicesService } from './services/vehicleServicesService.js'

const app = express()

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/public', publicRouter)
app.use('/api/admin', adminRouter)
app.use('/api/vehicles', vehicleRouter)
app.use('/api/services', servicesRouter)
app.use('/api', vehicleServicesRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/gallery', galleryRouter)
app.use('/api/testimonials', testimonialsRouter)
app.use('/api/translate', translateRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve static files from React build
const clientBuildPath = path.join(__dirname, '../../client/dist')
app.use(express.static(clientBuildPath))

// Handle React routing, return all requests to React app
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

    // Initialize Vehicle Services with demo data
    if (process.env.NODE_ENV !== 'production') {
      try {
        const demoData = await vehicleServicesService.initializeDemoData();
        console.log('✅ Vehicle services demo data initialized');
        console.log(`📋 ${demoData.services.length} services created`);
        console.log(`💰 ${demoData.servicePrices.length} price configurations created`);
      } catch (error) {
        console.log('⚠️  Vehicle services initialization failed:', error.message);
      }
    }
  } catch (error) {
    console.error('❌ Failed to initialize services:', error.message);
  }
}

const port = process.env.PORT || 8080
app.listen(port, async () => {
  console.log(`🚀 Server Spectra AutoArt rulează pe portul ${port}`)
  // Initialize services after server starts to avoid blocking
  setTimeout(() => {
    initializeServices().catch(error => {
      console.error('❌ Failed to initialize services:', error.message)
    })
  }, 1000)
})