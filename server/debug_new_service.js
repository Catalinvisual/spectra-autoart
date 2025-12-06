import { GoogleSheetsService } from './src/services/googleSheetsService.js';
import { vehicleServicesService } from './src/services/vehicleServicesService.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env.production') });

async function debugNewService() {
  console.log('🔍 Testing price sync for a completely new service...');
  
  // Initialize services
  const googleSheetsService = new GoogleSheetsService();
  await googleSheetsService.initialize();
  
  // Override sync function to add debugging
  const originalSync = vehicleServicesService.syncWithGoogleSheets;
  vehicleServicesService.syncWithGoogleSheets = async function() {
    console.log('🔄 Calling syncWithGoogleSheets...');
    const result = await originalSync.call(this);
    console.log('✅ syncWithGoogleSheets completed');
    return result;
  };
  
  // Create a unique service name to avoid conflicts
  const timestamp = Date.now();
  const serviceData = {
    name: `Debug Test Service ${timestamp}`,
    description: 'Test service for debugging price sync with new service',
    category: 'testing',
    duration_minutes: 90,
    is_active: true,
    prices: {
      sedan: {
        price_min: 75,
        price_max: 95,
        duration_minutes: 90
      },
      suv: {
        price_min: 85,
        price_max: 105,
        duration_minutes: 100
      },
      hatchback: {
        price_min: 65,
        price_max: 85,
        duration_minutes: 80
      }
    }
  };
  
  console.log('📝 Creating new service with prices:', JSON.stringify(serviceData, null, 2));
  
  try {
    const result = await vehicleServicesService.addServiceWithPrices(serviceData, serviceData.prices);
    console.log('✅ Service created successfully:', result.service.id);
    
    // Check if prices exist in Google Sheets
    console.log('🔍 Checking if prices were added to Google Sheets...');
    const sheet = googleSheetsService.doc.sheetsByTitle['Vehicle_Service_Prices'];
    const rows = await sheet.getRows();
    
    const servicePrices = rows.filter(row => {
      const serviceId = row.get('Service_ID');
      return serviceId === result.service.id;
    });
    
    console.log(`📊 Found ${servicePrices.length} prices in Google Sheets for service ${result.service.id}:`);
    servicePrices.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.get('Body_Type_Key')}: ${row.get('Price_Min')} ${row.get('Currency')} (${row.get('Duration_Minutes')} min) - ID: ${row.get('ID')}`);
    });
    
    if (servicePrices.length === 0) {
      console.log('❌ No prices found in Google Sheets for the new service!');
    } else {
      console.log('✅ Prices successfully added to Google Sheets!');
    }
    
  } catch (error) {
    console.error('❌ Error creating service:', error);
  }
}

debugNewService().catch(console.error);