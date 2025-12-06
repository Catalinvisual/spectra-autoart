import { config } from 'dotenv';
config({ path: '.env.production' });

import GoogleSheetsService from './src/services/googleSheetsService.js';
import { vehicleServicesService } from './src/services/vehicleServicesService.js';

async function debugPriceSync() {
  try {
    console.log('🚀 Starting price sync debug...');
    
    // Initialize Google Sheets service
    await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets service initialized');
    
    // Initialize vehicle services service
    await vehicleServicesService.loadFromGoogleSheets();
    console.log('✅ Vehicle services service initialized');
    
    // Create a test service with specific prices
    const timestamp = Date.now();
    const testService = {
      name: `Test Service Debug ${timestamp}`,
      description: 'Test service for debugging price sync',
      category: 'testing',
      duration_minutes: 90,
      is_active: true
    };
    
    const testPrices = {
      'sedan': { price_min: 75, price_max: 150, duration_minutes: 90 },
      'suv': { price_min: 85, price_max: 170, duration_minutes: 100 },
      'hatchback': { price_min: 65, price_max: 130, duration_minutes: 80 }
    };
    
    console.log('📝 Creating test service with prices:', JSON.stringify(testPrices, null, 2));
    
    // Override sync function to add debugging
    const originalSync = vehicleServicesService.syncWithGoogleSheets;
    vehicleServicesService.syncWithGoogleSheets = async function() {
      console.log('🔄 Calling syncWithGoogleSheets...');
      console.log('📊 Service prices before sync:', this.servicePrices.filter(p => p.service_id >= 176504300).length);
      
      try {
        const result = await originalSync.call(this);
        console.log('✅ syncWithGoogleSheets completed successfully');
        return result;
      } catch (error) {
        console.error('❌ syncWithGoogleSheets failed:', error);
        throw error;
      }
    };
    
    // Create the service
    const result = await vehicleServicesService.addServiceWithPrices(testService, testPrices);
    console.log('✅ Test service created:', result.service);
    console.log('💰 Prices created:', result.prices.length);
    
    // Check what was actually synced to Google Sheets
    console.log('\n🔍 Checking Google Sheets for the new service...');
    const sheet = GoogleSheetsService.doc.sheetsByTitle['Vehicle_Service_Prices'];
    if (sheet) {
      const rows = await sheet.getRows();
      const newPrices = rows.filter(row => {
        const serviceId = row.get('Service_ID');
        return serviceId && serviceId.toString() === result.service.id.toString();
      });
      
      console.log(`📊 Found ${newPrices.length} prices in Google Sheets for service ${result.service.id}`);
      newPrices.forEach(row => {
        console.log(`  - Body Type: ${row.get('Body_Type_Key')}, Price: ${row.get('Price_Min')} ${row.get('Currency')}`);
      });
      
      if (newPrices.length === 0) {
        console.log('❌ No prices found in Google Sheets for the new service!');
        
        // Let's check what the updateServicePricesIncremental function is doing
        console.log('\n🔍 Debugging updateServicePricesIncremental...');
        const existingPricesMap = new Map();
        rows.forEach(row => {
          const serviceId = row.get('Service_ID');
          const bodyTypeKey = row.get('Body_Type_Key');
          if (serviceId && bodyTypeKey) {
            const key = `${serviceId}_${bodyTypeKey}`;
            existingPricesMap.set(key, { row, priceId: row.get('ID')?.toString() });
          }
        });
        
        console.log(`📊 Existing prices map has ${existingPricesMap.size} entries`);
        
        // Check if our new prices would be added or updated
        result.prices.forEach(price => {
          const key = `${price.service_id}_${price.body_type_key}`;
          const existingData = existingPricesMap.get(key);
          console.log(`  - Price for ${price.body_type_key}: ${existingData ? 'EXISTS (would update)' : 'NEW (would add)'}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugPriceSync();