import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, 'server/.env');
dotenv.config({ path: envPath });

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_DEFAULT_EMAIL;

if (!JWT_SECRET || !ADMIN_EMAIL) {
  console.error('❌ Missing JWT_SECRET or ADMIN_DEFAULT_EMAIL in environment variables');
  process.exit(1);
}

// Generate a new JWT token
import jwt from 'jsonwebtoken';
const payload = {
  email: ADMIN_EMAIL,
  role: 'admin',
  id: 1,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
};

const token = jwt.sign(payload, JWT_SECRET);
console.log('🔑 Using JWT token for authentication');

// Test data with exact user prices
const testData = {
  name: 'Test Service Verification',
  description: 'Complete interior cleaning and detailing service',
  category: 'Interior Detailing',
  isActive: true,
  prices: {
    sedan: 11,
    suv: 22,
    hatchback: 33,
    cabrio: 44,
    coupe: 55,
    wagon: 66,
    van: 77,
    break: 88
  }
};

async function testServiceCreation() {
  try {
    console.log('🚀 Testing service creation with custom prices...');
    console.log('📊 Test data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post(
      'http://localhost:8080/api/admin/services/create-with-translation',
      testData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 seconds timeout
      }
    );

    console.log('\n✅ SUCCESS! Service creation completed!');
    console.log('📄 Full response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.serviceId) {
      const serviceId = response.data.serviceId;
      console.log(`\n🎯 Service created with ID: ${serviceId}`);
      console.log(`💰 Prices saved: ${response.data.pricesCount}`);
      
      // Wait a moment for Google Sheets sync to complete
      console.log('\n⏳ Waiting for Google Sheets sync to complete...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Now verify the prices in Google Sheets
      console.log('\n🔍 Verifying prices in Google Sheets...');
      
      // Import GoogleSheetsService to check the data
      const { GoogleSheetsService } = await import('./server/src/services/googleSheetsService.js');
      
      try {
        await GoogleSheetsService.initialize();
        
        // Get services with prices
        const services = await GoogleSheetsService.getServicesWithPrices();
        const newService = services.find(s => s.id === serviceId);
        
        if (newService) {
          console.log('✅ Service found in Google Sheets!');
          console.log(`📋 Service name: ${newService.name}`);
          console.log(`💰 Number of prices: ${newService.prices?.length || 0}`);
          
          if (newService.prices && newService.prices.length > 0) {
            console.log('\n📊 Price details:');
            newService.prices.forEach(price => {
              console.log(`  - ${price.body_type_key}: €${price.price_min} (${price.duration_minutes} min)`);
            });
            
            // Verify all 8 body types are present
            const expectedBodyTypes = ['sedan', 'suv', 'hatchback', 'cabrio', 'coupe', 'wagon', 'van', 'break'];
            const actualBodyTypes = newService.prices.map(p => p.body_type_key);
            const missingBodyTypes = expectedBodyTypes.filter(bt => !actualBodyTypes.includes(bt));
            
            if (missingBodyTypes.length === 0) {
              console.log('\n✅ All 8 body types are present!');
            } else {
              console.log(`\n⚠️  Missing body types: ${missingBodyTypes.join(', ')}`);
            }
            
            // Verify custom prices
            const priceMatches = newService.prices.filter(price => {
              const expectedPrice = testData.prices[price.body_type_key];
              return expectedPrice && price.price_min === expectedPrice;
            });
            
            console.log(`\n✅ Correct prices: ${priceMatches.length}/${expectedBodyTypes.length}`);
            
            if (priceMatches.length === expectedBodyTypes.length) {
              console.log('\n🎉 SUCCESS! All prices are correctly saved in Google Sheets!');
            } else {
              console.log('\n⚠️  Some prices don\'t match expected values');
              console.log('Expected prices:', testData.prices);
              console.log('Actual prices:', actualBodyTypes.map(bt => ({
                body_type: bt,
                price: newService.prices.find(p => p.body_type_key === bt)?.price_min
              })));
            }
          } else {
            console.log('⚠️  No prices found for this service');
          }
        } else {
          console.log('❌ Service not found in Google Sheets');
        }
        
      } catch (sheetsError) {
        console.error('❌ Error checking Google Sheets:', sheetsError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message || error);
    if (error.response) {
      console.error('📡 Response status:', error.response.status);
      console.error('📄 Response data:', error.response.data);
    }
  }
}

// Run the test
testServiceCreation();