import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
const envLocalPath = join(__dirname, '.env.local')
const envProductionPath = join(__dirname, '.env.production')
const envPath = join(__dirname, '.env')

// Try to load environment files in order
try {
  const result = dotenv.config({ path: envLocalPath })
  if (result.error) {
    console.log('⚠️  Could not load .env.local, trying .env.production...')
    const productionResult = dotenv.config({ path: envProductionPath })
    if (productionResult.error) {
      console.log('⚠️  Could not load .env.production, trying .env...')
      dotenv.config({ path: envPath })
    } else {
      console.log('✅ Loaded .env.production')
    }
  } else {
    console.log('✅ Loaded .env.local')
  }
} catch (error) {
  console.log('⚠️  Error loading environment files:', error.message)
}

import GoogleSheetsService from './src/services/googleSheetsService.js'

// Demo data for Vehicle_Services
const demoVehicleServices = [
  ['1', 'Premium Wash', 'Premium Wash', 'Premium Was', 'Complete exterior cleaning with premium products', 'Complete exterior cleaning with premium products', 'Complete exterieur reiniging met premium producten', 'exterior', 'exterior', 'exterieur', '45', 'true'],
  ['2', 'Interior Detail', 'Interior Detail', 'Interieur Detail', 'Deep interior cleaning with extraction and deodorizing', 'Deep interior cleaning with extraction and deodorizing', 'Diep interieur reiniging met extractie en deodoriseren', 'interior', 'interior', 'interieur', '120', 'true'],
  ['3', 'Ceramic Coating', 'Ceramic Coating', 'Ceramic Coating', 'Premium ceramic coating protection', 'Premium ceramic coating protection', 'Premium ceramic coating protectie', 'protection', 'protection', 'protectie', '240', 'true'],
  ['4', 'Engine Bay Cleaning', 'Engine Bay Cleaning', 'Motor Ruimte Reiniging', 'Professional engine bay cleaning', 'Professional engine bay cleaning', 'Professionele motor ruimte reiniging', 'engine', 'engine', 'motor', '60', 'true']
]

async function populateVehicleServices() {
  try {
    console.log('🔄 Populating Vehicle_Services with demo data...')
    
    // Force initialization
    console.log('🔄 Initializing Google Sheets service...')
    await GoogleSheetsService.initialize()
    
    // Get current data to see what's there
    console.log('📊 Checking current Vehicle_Services data...')
    const currentData = await GoogleSheetsService.getData('Vehicle_Services')
    console.log('📊 Current data has', currentData.length, 'rows')
    
    // Add demo services one by one
    for (let i = 0; i < demoVehicleServices.length; i++) {
      const service = demoVehicleServices[i]
      console.log(`➕ Adding service: ${service[1]}`)
      await GoogleSheetsService.appendData('Vehicle_Services', service)
      console.log(`✅ Added service: ${service[1]}`)
    }
    
    console.log('✅ Successfully populated Vehicle_Services with demo data')
    
    // Verify the data was added
    console.log('🔍 Verifying data...')
    const newData = await GoogleSheetsService.getData('Vehicle_Services')
    console.log('📊 New data has', newData.length, 'rows')
    
  } catch (error) {
    console.error('❌ Error populating vehicle services:', error)
  }
}

populateVehicleServices()