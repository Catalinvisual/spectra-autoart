import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, 'server/.env');
dotenv.config({ path: envPath });

async function verifyGoogleSheetsSync() {
  try {
    console.log('🔍 Verifying Google Sheets sync for service ID 176505151...');
    
    const { GoogleSheetsService } = await import('./server/src/services/googleSheetsService.js');
    
    try {
      await GoogleSheetsService.initialize();
      
      // Get services with prices
      const services = await GoogleSheetsService.getServicesWithPrices();
      const service = services.find(s => s.id === 176505151);
      
      if (service) {
        console.log('✅ Service found in Google Sheets!');
        console.log(`📋 Service name: ${service.name}`);
        console.log(`💰 Number of prices: ${service.prices?.length || 0}`);
        
        if (service.prices && service.prices.length > 0) {
          console.log('\n📊 Price details:');
          service.prices.forEach(price => {
            console.log(`  - ${price.body_type_key}: €${price.price_min} (${price.duration_minutes} min)`);
          });
          
          // Check if all 8 body types are present
          const expectedBodyTypes = ['sedan', 'suv', 'hatchback', 'cabrio', 'coupe', 'wagon', 'van', 'break'];
          const actualBodyTypes = service.prices.map(p => p.body_type_key);
          const missingBodyTypes = expectedBodyTypes.filter(bt => !actualBodyTypes.includes(bt));
          
          if (missingBodyTypes.length === 0) {
            console.log('\n✅ All 8 body types are present!');
          } else {
            console.log(`\n⚠️  Missing body types: ${missingBodyTypes.join(', ')}`);
          }
          
          // Check expected prices
          const expectedPrices = {
            sedan: 11, suv: 22, hatchback: 33, cabrio: 44, 
            coupe: 55, wagon: 66, van: 77, break: 88
          };
          
          console.log('\n🔍 Price verification:');
          let correctPrices = 0;
          Object.entries(expectedPrices).forEach(([bodyType, expectedPrice]) => {
            const actualPrice = service.prices.find(p => p.body_type_key === bodyType)?.price_min;
            if (actualPrice === expectedPrice) {
              console.log(`  ✅ ${bodyType}: €${actualPrice} (correct)`);
              correctPrices++;
            } else {
              console.log(`  ❌ ${bodyType}: €${actualPrice} (expected €${expectedPrice})`);
            }
          });
          
          console.log(`\n📈 Summary: ${correctPrices}/${expectedBodyTypes.length} prices are correct`);
          
          if (correctPrices === expectedBodyTypes.length) {
            console.log('\n🎉 SUCCESS! All prices are correctly saved in Google Sheets!');
          }
        } else {
          console.log('⚠️  No prices found for this service');
        }
      } else {
        console.log('❌ Service not found in Google Sheets');
        
        // Show last few services for reference
        console.log('\n📋 Last 5 services in Google Sheets:');
        const recentServices = services.slice(-5);
        recentServices.forEach(s => {
          console.log(`  - ID: ${s.id}, Name: ${s.name}, Prices: ${s.prices?.length || 0}`);
        });
      }
      
    } catch (sheetsError) {
      console.error('❌ Error accessing Google Sheets:', sheetsError.message);
      if (sheetsError.message.includes('demo')) {
        console.log('⚠️  Google Sheets is in demo mode - this is expected in test environment');
      }
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message || error);
  }
}

// Run verification
verifyGoogleSheetsSync();